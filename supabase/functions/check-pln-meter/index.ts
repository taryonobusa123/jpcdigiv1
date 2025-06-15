
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { meter_number } = await req.json();

    if (!meter_number) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Nomor meter harus diisi'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Checking PLN meter:', meter_number);

    // Call Digiflazz inquiry API
    const inquiryResult = await callDigiflazzInquiry(meter_number);
    
    console.log('Inquiry result:', inquiryResult);

    if (!inquiryResult.success) {
      return new Response(JSON.stringify({ 
        success: false,
        message: inquiryResult.message || 'Gagal mengecek nomor meter'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      data: inquiryResult.data,
      message: 'Data pelanggan ditemukan'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PLN meter check error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      message: 'Terjadi kesalahan sistem'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callDigiflazzInquiry(meterNumber: string) {
  const username = Deno.env.get('DIGIFLAZZ_USERNAME');
  const apiKey = Deno.env.get('DIGIFLAZZ_API_KEY');
  
  if (!username || !apiKey) {
    console.error('Digiflazz credentials not configured');
    return {
      success: false,
      message: 'Konfigurasi API tidak lengkap. Silakan hubungi administrator.'
    };
  }

  // Generate ref_id for inquiry
  const ref_id = `INQ${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  
  // Generate signature using MD5
  const sign = await generateMD5Signature(username, apiKey, ref_id);
  
  const payload = {
    username,
    buyer_sku_code: 'plncek', // PLN inquiry SKU
    customer_no: meterNumber,
    ref_id,
    sign,
    cmd: 'inq-pasca', // Inquiry command
  };

  console.log('Calling Digiflazz inquiry API with payload:', {
    ...payload,
    sign: '***hidden***'
  });

  try {
    const response = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Digiflazz raw response:', responseText);
    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return {
        success: false,
        message: `Server error: ${response.status}`
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return {
        success: false,
        message: 'Format respons server tidak valid'
      };
    }

    console.log('Digiflazz parsed response:', result);
    
    // Check specific error messages
    if (result.data) {
      // Check for IP whitelist error
      if (result.data.message && result.data.message.includes('IP Anda tidak kami kenali')) {
        return {
          success: false,
          message: 'IP server belum terdaftar di Digiflazz. Silakan hubungi administrator untuk menambahkan IP ke whitelist.'
        };
      }
      
      // Check for other errors
      if (result.data.status === 'Gagal' || result.data.rc !== '00') {
        return {
          success: false,
          message: result.data.message || 'Nomor meter tidak ditemukan atau tidak valid'
        };
      }
      
      // Check if inquiry was successful
      if (result.data.status === 'Sukses' || result.data.rc === '00') {
        return {
          success: true,
          data: {
            customer_name: result.data.customer_name || result.data.desc || 'Nama tidak tersedia',
            customer_no: meterNumber,
            tarif: result.data.tarif || result.data.desc || 'R1/900VA',
            power: result.data.power || '900VA'
          }
        };
      }
    }
    
    return {
      success: false,
      message: result.message || 'Nomor meter tidak ditemukan atau tidak valid'
    };
  } catch (error) {
    console.error('Digiflazz inquiry API error:', error);
    return {
      success: false,
      message: 'Gagal menghubungi server provider. Silakan coba lagi.'
    };
  }
}

async function generateMD5Signature(username: string, apiKey: string, refId: string): Promise<string> {
  const text = username + apiKey + refId;
  
  try {
    const { default: CryptoJS } = await import('https://esm.sh/crypto-js@4.1.1');
    const hash = CryptoJS.MD5(text).toString();
    
    console.log('Generated MD5 signature successfully');
    return hash;
  } catch (error) {
    console.error('Error generating MD5 signature:', error);
    
    // Fallback hash function
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const fallbackHash = Math.abs(hash).toString(16);
    console.log('Using fallback hash');
    return fallbackHash;
  }
}
