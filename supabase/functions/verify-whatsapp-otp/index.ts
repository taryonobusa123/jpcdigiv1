
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { whatsapp_number, otp_code, user_id } = await req.json();
    
    console.log('Verifying OTP:', { whatsapp_number, otp_code, user_id });
    
    if (!whatsapp_number || !otp_code) {
      return new Response(
        JSON.stringify({ error: 'Nomor WhatsApp dan kode OTP diperlukan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up expired OTPs first
    const { error: cleanupError } = await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('whatsapp_number', whatsapp_number)
      .eq('otp_code', otp_code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('OTP query result:', { otpData, otpError });

    if (otpError) {
      console.error('Database error:', otpError);
      return new Response(
        JSON.stringify({ error: 'Terjadi kesalahan saat memverifikasi OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otpData) {
      return new Response(
        JSON.stringify({ error: 'Kode OTP tidak valid atau sudah kadaluarsa' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ is_used: true })
      .eq('id', otpData.id);

    if (updateError) {
      console.error('Update OTP error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Gagal memperbarui status OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user profile verification status
    if (user_id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_whatsapp_verified: true })
        .eq('id', user_id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the whole operation if profile update fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verifikasi WhatsApp berhasil' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan server' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
