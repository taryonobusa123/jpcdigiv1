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

    let body: any;
    try {
      body = await req.json();
      console.log('Request body:', body);
    } catch (e) {
      console.error('Body parsing error:', e);
      return new Response(JSON.stringify({ error: 'Invalid JSON body', detail: `${e}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Body validation (transaction_id wajib)
    const { transaction_id } = body;
    if (!transaction_id) {
      console.error('Request missing transaction_id:', body);
      return new Response(JSON.stringify({ error: 'Missing transaction_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get transaction
    const { data: transaction, error: selectError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (selectError || !transaction) {
      console.error('Transaction not found:', selectError, transaction_id);
      return new Response(JSON.stringify({ error: 'Transaction not found', detail: selectError }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile buat cek balance
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('balance')
      .eq('id', transaction.user_id)
      .single();

    if (profileError || !profile) {
      console.error('User profile not found or error:', profileError, transaction.user_id);
      return new Response(JSON.stringify({ error: 'User profile not found', detail: profileError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Cek cukup saldo
    if (
      typeof transaction.price !== 'number' ||
      profile.balance < transaction.price
    ) {
      console.error('Insufficient balance. User balance:', profile.balance, 'Required:', transaction.price);
      return new Response(JSON.stringify({ error: 'Insufficient balance', detail: { user_balance: profile.balance, need: transaction.price } }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deduct balance from user + debug logging
    console.log("About to deduct balance, params:", {
      p_user_id: transaction.user_id,
      p_amount: -transaction.price,
      p_type: 'purchase',
      p_description: `Pembelian ${transaction.product_name}`,
      p_transaction_id: transaction.id,
    });

    const balanceUpdateResult = await supabaseClient.rpc('update_user_balance', {
      p_user_id: transaction.user_id,
      p_amount: -transaction.price,
      p_type: 'purchase',
      p_description: `Pembelian ${transaction.product_name}`,
      p_transaction_id: transaction.id,
    });

    if (!balanceUpdateResult.data) {
      console.error('Failed to deduct balance. RPC error:', balanceUpdateResult.error, 'response:', balanceUpdateResult);
      return new Response(JSON.stringify({ 
        error: 'Failed to deduct balance',
        detail: balanceUpdateResult.error ?? balanceUpdateResult,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Import dari utils baru
    import { callDigiflazzAPI } from './utils/callDigiflazzAPI.ts';

    // Call Digiflazz API
    let digiflazzResponse;
    try {
      digiflazzResponse = await callDigiflazzAPI({
        customer_id: transaction.customer_id,
        sku: transaction.sku,
        ref_id: transaction.ref_id,
      });
      console.log('Digiflazz API Raw Response:', digiflazzResponse);

      // Digiflazz error wrapper/status check
      if (!digiflazzResponse || !digiflazzResponse.data) {
        console.error('Digiflazz: Malformed or missing data field.', digiflazzResponse);
        return new Response(JSON.stringify({ 
          error: 'Digiflazz API responded with malformed or missing data',
          digiflazz_response: digiflazzResponse
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const dStatus = String(digiflazzResponse.data.status || '').toLowerCase();

      // GAGAL, FAILED, error code, dsb
      if (dStatus === 'gagal' || dStatus === 'failed' || digiflazzResponse.data.rc === '39') {
        console.error('Digiflazz Failure:', digiflazzResponse.data);
        return new Response(JSON.stringify({ 
          error: 'Digiflazz API responded with failure',
          digiflazz_response: digiflazzResponse
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (digiflazzErr) {
      console.error('Digiflazz API error:', digiflazzErr);
      return new Response(JSON.stringify({ 
        error: 'Digiflazz API error', 
        detail: digiflazzErr?.message ?? digiflazzErr
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update transaction dengan result Digiflazz
    try {
      const { error: updateError } = await supabaseClient
        .from('transactions')
        .update({
          status: digiflazzResponse.data?.status || 'pending',
          message: digiflazzResponse.data?.message,
          digiflazz_trx_id: digiflazzResponse.data?.trx_id ?? '',
          rc: digiflazzResponse.data?.rc,
          serial_number: digiflazzResponse.data?.sn ?? '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction_id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
        return new Response(JSON.stringify({ 
          error: 'Error updating transaction', 
          detail: updateError.message 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (updateErr) {
      console.error('Exception during transaction update:', updateErr);
      return new Response(JSON.stringify({ 
        error: 'Exception updating transaction',
        detail: updateErr?.message ?? updateErr
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Success return
    return new Response(JSON.stringify({ 
      success: true, 
      transaction: digiflazzResponse.data 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // catch-all fallback
    console.error('Transaction processing error (unhandled):', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error in process-transaction'
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

  // SESUAI DOKUMEN DIGIFLAZZ (buyer_sku_code, customer_no, ref_id, sign)
  const payload = {
    username,
    buyer_sku_code: params.sku,        // pastikan ini sesuai dengan field product di database
    customer_no: params.customer_id,   // map ke field yg benar
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
    console.log('Digiflazz API full response:', result);
    
    // Forward error detail jika ada
    if (!result.data) {
      throw new Error(`Digiflazz API response missing 'data' field! ${JSON.stringify(result)}`);
    }
    
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
