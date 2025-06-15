
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { validateInput } from './utils/validateInput.ts';
import { fetchTransaction, updateTransactionStatus, updateUserBalance } from './utils/transactionUtils.ts';
import { callDigiflazzTransaction } from './utils/callDigiflazzTransaction.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { transaction_id, ref_id, customer_id, sku, price } = body;

    console.log('Purchase PLN Direct called with:', { transaction_id, ref_id, customer_id, sku, price });

    // Validate input
    const validation = validateInput(body);
    if (!validation.valid) {
      console.error('[VALIDATION ERROR] Missing required parameters', { transaction_id, ref_id, customer_id, sku, price });
      return new Response(JSON.stringify({ 
        success: false,
        message: validation.message
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check transaction exists
    const { transaction, error: fetchError } = await fetchTransaction(supabase, transaction_id);

    if (fetchError || !transaction) {
      console.error('[FETCH ERROR] Error fetching transaction:', fetchError);
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Transaksi tidak ditemukan'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Digiflazz transaction API
    let transactionResult;
    try {
      transactionResult = await callDigiflazzTransaction(ref_id, customer_id, sku);
    } catch (digiflazzError) {
      console.error('[DIGIFLAZZ ERROR] Error during Digiflazz call:', digiflazzError);
      transactionResult = {
        success: false,
        message: `[Digiflazz] ${digiflazzError?.message || digiflazzError?.toString() || 'Unknown error'}`
      };
    }
    console.log('Digiflazz transaction result:', transactionResult);

    // Update transaction status in database
    const { updatedTransaction, error: updateError } = await updateTransactionStatus(
      supabase,
      transaction_id,
      transactionResult.success ? 'success' : 'failed',
      transactionResult.message,
      {
        digiflazz_trx_id: transactionResult.digiflazz_trx_id,
        serial_number: transactionResult.serial_number,
      }
    );

    if (updateError) {
      console.error('[DB UPDATE ERROR] Error updating transaction after Digiflazz:', updateError);
    }

    // If transaction successful, update user balance
    if (transactionResult.success) {
      console.log('Transaction successful, updating user balance...');
      const { error: balanceError } = await updateUserBalance(
        supabase,
        transaction.user_id,
        price,
        sku,
        customer_id,
        transaction_id
      );
      if (balanceError) {
        console.error('[BALANCE UPDATE ERROR] Error updating balance:', balanceError);
      } else {
        console.log('Balance updated successfully for user:', transaction.user_id);
      }
    }

    // Return proper success or fail message
    if (!transactionResult.success) {
      return new Response(JSON.stringify({ 
        success: false,
        message: transactionResult.message || 'Gagal memproses transaksi',
        digiflazz_error: true
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: transactionResult.message || 'Transaksi berhasil',
      data: transactionResult,
      updatedTransaction
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errMessage = `[SERVER ERROR] ${error?.message || error?.toString() || error}`;
    console.error('PLN direct purchase error:', errMessage);
    return new Response(JSON.stringify({ 
      success: false,
      message: errMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
