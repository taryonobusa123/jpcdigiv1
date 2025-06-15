
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
    const { whatsapp_number } = await req.json();
    
    if (!whatsapp_number) {
      return new Response(
        JSON.stringify({ error: 'Nomor WhatsApp diperlukan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean up expired OTPs
    await supabase.rpc('cleanup_expired_otp');

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otp_codes')
      .insert({
        whatsapp_number,
        otp_code: otpCode,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Gagal menyimpan OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send WhatsApp message using WaPanels API
    const formData = new FormData();
    formData.append('appkey', 'caa6aa7f-8086-4920-899d-4ac498a62eea');
    formData.append('authkey', 'dAUtf7zkmSDKTTZdAXb48oE29tB9NIWkldd3tr90ucGedWCPu3');
    formData.append('to', whatsapp_number);
    formData.append('message', `Kode verifikasi Anda: *${otpCode}*\n\nKode ini berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.`);

    const whatsappResponse = await fetch('https://app.wapanels.com/api/create-message', {
      method: 'POST',
      body: formData,
    });

    const whatsappResult = await whatsappResponse.text();
    console.log('WhatsApp API response:', whatsappResult);

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API error:', whatsappResult);
      return new Response(
        JSON.stringify({ error: 'Gagal mengirim pesan WhatsApp' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Kode OTP berhasil dikirim ke WhatsApp Anda' 
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
