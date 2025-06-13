
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

    const body = await req.json();
    console.log('Digiflazz webhook received:', JSON.stringify(body, null, 2));

    // Validate webhook data structure
    if (!body.data || !body.data.ref_id) {
      console.error('Invalid webhook data structure:', body);
      return new Response(JSON.stringify({ error: 'Invalid webhook data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookData = body.data;

    // Find transaction by ref_id
    const { data: transaction, error: selectError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('ref_id', webhookData.ref_id)
      .single();

    if (selectError) {
      console.error('Error finding transaction:', selectError);
      return new Response(JSON.stringify({ 
        error: 'Transaction not found',
        ref_id: webhookData.ref_id 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found transaction:', transaction.id, 'for ref_id:', webhookData.ref_id);

    // Update transaction with webhook data
    const updateData: any = {
      status: webhookData.status,
      message: webhookData.message,
      rc: webhookData.rc,
      updated_at: new Date().toISOString(),
    };

    // Add optional fields if they exist
    if (webhookData.sn) updateData.serial_number = webhookData.sn;
    if (webhookData.trx_id) updateData.digiflazz_trx_id = webhookData.trx_id;

    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update(updateData)
      .eq('ref_id', webhookData.ref_id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return new Response(JSON.stringify({ 
        error: 'Failed to update transaction',
        details: updateError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Transaction updated successfully:', webhookData.ref_id, 'Status:', webhookData.status);

    // If transaction failed, refund the balance
    if (webhookData.status === 'Gagal') {
      console.log('Processing refund for failed transaction:', webhookData.ref_id);
      
      const { data: refundResult, error: refundError } = await supabaseClient.rpc('update_user_balance', {
        p_user_id: transaction.user_id,
        p_amount: transaction.price, // Refund the amount
        p_type: 'refund',
        p_description: `Refund untuk transaksi gagal ${transaction.ref_id}`,
        p_transaction_id: transaction.id,
      });

      if (refundError) {
        console.error('Error processing refund:', refundError);
      } else {
        console.log('Refund processed successfully for:', webhookData.ref_id);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Webhook processed successfully',
      ref_id: webhookData.ref_id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
