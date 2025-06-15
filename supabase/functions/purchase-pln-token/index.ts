
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { ref_id, customer_id, amount, admin_fee, customer_name } = await req.json();

    console.log('Processing PLN token purchase:', { ref_id, customer_id, amount, admin_fee });

    // Find appropriate PLN product from database
    const { data: plnProduct, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('category', 'electricity')
      .eq('buyer_price', amount + admin_fee)
      .eq('is_active', true)
      .maybeSingle();

    if (productError) {
      console.error('Error finding PLN product:', productError);
      throw new Error('Gagal menemukan produk PLN');
    }

    if (!plnProduct) {
      console.log('No PLN product found for amount:', amount + admin_fee);
      throw new Error('Produk PLN tidak tersedia untuk nominal ini');
    }

    console.log('Found PLN product:', plnProduct.product_name, plnProduct.buyer_sku_code);

    // Call Digiflazz API for PLN token purchase
    const digiflazzResponse = await callDigiflazzPurchase({
      customer_id,
      sku: plnProduct.buyer_sku_code,
      ref_id,
    });

    console.log('Digiflazz PLN purchase response:', digiflazzResponse);

    // Save transaction to database
    const { error: insertError } = await supabaseClient
      .from('transactions')
      .insert({
        ref_id: ref_id,
        customer_id: customer_id,
        sku: plnProduct.buyer_sku_code,
        product_name: `PLN Token ${amount.toLocaleString('id-ID')}`,
        price: amount + admin_fee,
        status: digiflazzResponse.data?.status || 'Pending',
        message: digiflazzResponse.data?.message || 'Transaksi diproses',
        rc: digiflazzResponse.data?.rc || '',
        serial_number: digiflazzResponse.data?.sn || '',
        digiflazz_trx_id: digiflazzResponse.data?.trx_id || '',
      });

    if (insertError) {
      console.error('Error saving PLN transaction:', insertError);
      throw insertError;
    }

    console.log('PLN token purchase saved successfully');

    return new Response(JSON.stringify({ 
      success: true,
      transaction: digiflazzResponse.data,
      ref_id: ref_id,
      message: 'Pembelian token PLN berhasil'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PLN token purchase error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      message: error.message || 'Gagal membeli token PLN'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callDigiflazzPurchase(params: any) {
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

  console.log('Calling Digiflazz purchase API for PLN token:', payload);

  try {
    const response = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('Digiflazz PLN purchase raw response:', result);
    
    return result;
  } catch (error) {
    console.error('Digiflazz PLN purchase API call failed:', error);
    throw error;
  }
}

async function generateMD5Signature(username: string, apiKey: string, refId: string): Promise<string> {
  const text = username + apiKey + refId;
  
  try {
    const { default: CryptoJS } = await import('https://esm.sh/crypto-js@4.1.1');
    const hash = CryptoJS.MD5(text).toString();
    
    console.log('Generated MD5 signature for PLN purchase');
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
    console.log('Using fallback hash for PLN purchase');
    return fallbackHash;
  }
}
