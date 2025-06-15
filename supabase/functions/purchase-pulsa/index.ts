
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { validateInput } from './utils/validateInput.ts';
import { callDigiflazzTransaction } from './utils/callDigiflazzTransaction.ts';
import { fetchTransaction, updateTransactionStatus, updateUserBalance } from './utils/transactionUtils.ts';

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

    // Validasi input
    const { valid, message } = validateInput(body);
    if (!valid) {
      return new Response(JSON.stringify({ 
        success: false,
        message,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { transaction_id, ref_id, phone_number, sku, price } = body;

    console.log('Processing pulsa purchase:', { transaction_id, ref_id, phone_number, sku, price });

    // Get transaction details first
    const { transaction, error: fetchError } = await fetchTransaction(supabase, transaction_id);

    if (fetchError || !transaction) {
      console.error('Error fetching transaction:', fetchError);
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Transaksi tidak ditemukan'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Digiflazz transaction API
    const transactionResult = await callDigiflazzTransaction(ref_id, phone_number, sku);
    console.log('Transaction result:', transactionResult);

    // Update transaction status in database
    const { updatedTransaction, error: updateError } = await updateTransactionStatus(
      supabase, transaction_id, 
      transactionResult.success ? 'success' : 'failed',
      transactionResult.message,
      {
        digiflazz_trx_id: transactionResult.digiflazz_trx_id,
        serial_number: transactionResult.serial_number,
      }
    );
    if (updateError) {
      console.error('Error updating transaction:', updateError);
    }

    // If transaction successful, update user balance
    if (transactionResult.success) {
      const { error: balanceError } = await updateUserBalance(
        supabase,
        transaction.user_id,
        price,
        sku,
        phone_number,
        transaction_id
      );
      if (balanceError) {
        console.error('Error updating balance:', balanceError);
      } else {
        console.log('Balance updated successfully for user:', transaction.user_id);
      }
    }

    return new Response(JSON.stringify({ 
      success: transactionResult.success,
      message: transactionResult.message,
      data: transactionResult
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Pulsa purchase error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      message: 'Terjadi kesalahan sistem'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
