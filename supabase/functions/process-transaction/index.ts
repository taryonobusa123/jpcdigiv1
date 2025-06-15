
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

let CryptoJS: any;
const loadCryptoJs = async () => {
  if (!CryptoJS) {
    CryptoJS = (await import('https://esm.sh/crypto-js@4.1.1')).default;
  }
};

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

    const { transaction_id } = await req.json();

    // Get transaction details
    const { data: transaction, error: selectError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (selectError) {
      throw new Error('Transaction not found');
    }

    // Get user profile for balance check
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('balance')
      .eq('id', transaction.user_id)
      .single();

    if (profileError) {
      throw new Error('User profile not found');
    }

    // Check if user has sufficient balance
    if (profile.balance < transaction.price) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance from user
    const balanceUpdateResult = await supabaseClient.rpc('update_user_balance', {
      p_user_id: transaction.user_id,
      p_amount: -transaction.price,
      p_type: 'purchase',
      p_description: `Pembelian ${transaction.product_name}`,
      p_transaction_id: transaction.id,
    });

    if (!balanceUpdateResult.data) {
      throw new Error('Failed to deduct balance');
    }

    // Call Digiflazz API
    const digiflazzResponse = await callDigiflazzAPI({
      customer_id: transaction.customer_id,
      sku: transaction.sku,
      ref_id: transaction.ref_id,
    });

    console.log('Digiflazz API Response:', digiflazzResponse);

    // Update transaction with Digiflazz response
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: digiflazzResponse.data?.status || 'pending',
        message: digiflazzResponse.data?.message,
        digiflazz_trx_id: digiflazzResponse.data?.trx_id,
        rc: digiflazzResponse.data?.rc,
        serial_number: digiflazzResponse.data?.sn,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction_id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      transaction: digiflazzResponse.data 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Transaction processing error:', error);
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

  // Generate signature using CryptoJS.MD5
  const sign = await generateSignature(username, apiKey, params.ref_id);
  
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

// Generate MD5 signature for Digiflazz
async function generateSignature(username: string, apiKey: string, refId: string): Promise<string> {
  await loadCryptoJs();
  const text = username + apiKey + refId;
  try {
    const hash = CryptoJS.MD5(text).toString();
    console.log('Generated MD5 signature successfully');
    return hash;
  } catch (error) {
    console.error('Error generating MD5 signature:', error);
    // fallback
    return '';
  }
}
