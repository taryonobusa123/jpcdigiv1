
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('Digiflazz webhook received:', body);

    // Update transaction status
    const { data: transaction, error: selectError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('ref_id', body.data.ref_id)
      .single();

    if (selectError) {
      console.error('Error finding transaction:', selectError);
      return new Response(JSON.stringify({ error: 'Transaction not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update transaction
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: body.data.status,
        message: body.data.message,
        serial_number: body.data.sn,
        digiflazz_trx_id: body.data.trx_id,
        rc: body.data.rc,
        updated_at: new Date().toISOString(),
      })
      .eq('ref_id', body.data.ref_id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update transaction' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If transaction failed, refund the balance
    if (body.data.status === 'Gagal') {
      const { error: refundError } = await supabaseClient.rpc('update_user_balance', {
        p_user_id: transaction.user_id,
        p_amount: transaction.price, // Refund the amount
        p_type: 'refund',
        p_description: `Refund untuk transaksi ${transaction.ref_id}`,
        p_transaction_id: transaction.id,
      });

      if (refundError) {
        console.error('Error processing refund:', refundError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
