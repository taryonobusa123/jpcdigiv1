
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Checking PLN meter:', meter_number);

    // Call Digiflazz inquiry API
    const inquiryResult = await callDigiflazzInquiry(meter_number);
    
    if (!inquiryResult.success) {
      return new Response(JSON.stringify({ 
        success: false,
        message: inquiryResult.message || 'Gagal mengecek nomor meter'
      }), {
        status: 400,
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
      message: error.message || 'Terjadi kesalahan sistem'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callDigiflazzInquiry(meterNumber: string) {
  const username = Deno.env.get('DIGIFLAZZ_USERNAME');
  const apiKey = Deno.env.get('DIGIFLAZZ_API_KEY');
  
  if (!username || !apiKey) {
    throw new Error('Digiflazz credentials not configured');
  }

  // Generate ref_id for inquiry
  const ref_id = `INQ${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  
  // Generate signature using MD5
  const sign = await generateMD5Signature(username, apiKey, ref_id);
  
  const payload = {
    username,
    buyer_sku_code: 'pln', // Use a generic PLN inquiry SKU
    customer_no: meterNumber,
    ref_id,
    sign,
    cmd: 'inq-pasca', // Inquiry command for postpaid
  };

  console.log('Calling Digiflazz inquiry API for meter:', meterNumber);

  try {
    const response = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Digiflazz inquiry response:', result);
    
    if (result.data && result.data.status === 'Sukses') {
      return {
        success: true,
        data: {
          customer_name: result.data.customer_name || 'Nama tidak tersedia',
          customer_no: meterNumber,
          tarif: result.data.desc || 'Tarif tidak tersedia',
        }
      };
    } else {
      return {
        success: false,
        message: result.data?.message || 'Nomor meter tidak ditemukan'
      };
    }
  } catch (error) {
    console.error('Digiflazz inquiry API error:', error);
    return {
      success: false,
      message: 'Gagal menghubungi server Digiflazz'
    };
  }
}

async function generateMD5Signature(username: string, apiKey: string, refId: string): Promise<string> {
  const text = username + apiKey + refId;
  
  try {
    const { default: CryptoJS } = await import('https://esm.sh/crypto-js@4.1.1');
    const hash = CryptoJS.MD5(text).toString();
    
    console.log('Generated MD5 signature for inquiry');
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
    console.log('Using fallback hash for inquiry');
    return fallbackHash;
  }
}
