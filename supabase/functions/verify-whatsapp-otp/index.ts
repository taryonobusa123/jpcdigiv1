
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
    const { whatsapp_number, otp_code } = await req.json();
    
    if (!whatsapp_number || !otp_code) {
      return new Response(
        JSON.stringify({ error: 'Nomor WhatsApp dan kode OTP diperlukan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    if (otpError || !otpData) {
      return new Response(
        JSON.stringify({ error: 'Kode OTP tidak valid atau sudah kadaluarsa' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as used
    await supabase
      .from('otp_codes')
      .update({ is_used: true })
      .eq('id', otpData.id);

    // Check if user profile exists with this WhatsApp number
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('whatsapp_number', whatsapp_number)
      .maybeSingle();

    let userId = existingProfile?.id;

    if (!existingProfile) {
      // Create new user account
      const tempEmail = `${whatsapp_number.replace('+', '')}@temp.whatsapp.local`;
      const tempPassword = Math.random().toString(36).substring(2, 15);

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: tempEmail,
        password: tempPassword,
        user_metadata: {
          whatsapp_number: whatsapp_number,
          whatsapp_verified: true
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        return new Response(
          JSON.stringify({ error: 'Gagal membuat akun' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = authData.user.id;

      // Update profile with verification status
      await supabase
        .from('profiles')
        .update({ 
          is_whatsapp_verified: true,
          whatsapp_number: whatsapp_number
        })
        .eq('id', userId);
    } else {
      // Update existing profile verification status
      await supabase
        .from('profiles')
        .update({ is_whatsapp_verified: true })
        .eq('id', userId);
    }

    // Generate login token for the user
    const { data: tokenData, error: tokenError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: existingProfile?.email || `${whatsapp_number.replace('+', '')}@temp.whatsapp.local`,
    });

    if (tokenError) {
      console.error('Token generation error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Gagal membuat sesi login' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verifikasi WhatsApp berhasil',
        access_token: tokenData.properties?.access_token,
        refresh_token: tokenData.properties?.refresh_token,
        user_id: userId
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
