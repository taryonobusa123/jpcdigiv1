
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { ref_id, customer_id, sku, product_name, price } = await req.json();

    console.log('Processing test transaction:', { ref_id, customer_id, sku, product_name, price });

    // Call Digiflazz API for real transaction
    const digiflazzResponse = await callDigiflazzAPI({
      customer_id,
      sku,
      ref_id,
    });

    console.log('Digiflazz API Response:', digiflazzResponse);

    // Save to transaksi_digiflazz table
    const { error: insertError } = await supabaseClient
      .from('transaksi_digiflazz')
      .insert({
        ref_id: ref_id,
        customer_no: customer_id,
        buyer_sku_code: sku,
        price: price.toString(),
        status: digiflazzResponse.data?.status || 'Pending',
        message: digiflazzResponse.data?.message || 'Transaction submitted',
        rc: digiflazzResponse.data?.rc || '',
        sn: digiflazzResponse.data?.sn || '',
        ref_id_digiflazz: digiflazzResponse.data?.trx_id || '',
        buyer_last_saldo: digiflazzResponse.data?.buyer_last_saldo || '0',
        tele: '', // Not used in test
        wa: '', // Not used in test
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error saving transaction:', insertError);
      throw insertError;
    }

    console.log('Test transaction saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      transaction: digiflazzResponse.data,
      ref_id: ref_id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Test transaction error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Real Digiflazz API call
async function callDigiflazzAPI(params: any) {
  const username = Deno.env.get('DIGIFLAZZ_USERNAME');
  const apiKey = Deno.env.get('DIGIFLAZZ_API_KEY');
  
  if (!username || !apiKey) {
    throw new Error('Digiflazz credentials not configured');
  }

  // Generate signature using MD5
  const sign = await generateMD5Signature(username, apiKey, params.ref_id);
  
  const payload = {
    username,
    buyer_sku_code: params.sku,
    customer_no: params.customer_id,
    ref_id: params.ref_id,
    sign,
  };

  console.log('Calling Digiflazz API with payload:', payload);

  try {
    const response = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('Digiflazz API raw response:', result);
    
    return result;
  } catch (error) {
    console.error('Digiflazz API call failed:', error);
    throw error;
  }
}

// Generate MD5 signature for Digiflazz using crypto-js library
async function generateMD5Signature(username: string, apiKey: string, refId: string): Promise<string> {
  const text = username + apiKey + refId;
  
  // Use external crypto library for MD5 since Deno doesn't support it natively
  const cryptoJs = await import('https://esm.sh/crypto-js@4.1.1');
  const hash = cryptoJs.MD5(text).toString();
  
  console.log('Generated MD5 signature for:', text, '-> Hash:', hash);
  return hash;
}
