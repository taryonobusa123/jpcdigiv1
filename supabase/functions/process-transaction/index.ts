
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

    // Call Digiflazz API (in production, replace with actual API call)
    const digiflazzResponse = await callDigiflazzAPI({
      customer_id: transaction.customer_id,
      sku: transaction.sku,
      ref_id: transaction.ref_id,
    });

    // Update transaction with Digiflazz response
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: digiflazzResponse.status || 'pending',
        message: digiflazzResponse.message,
        digiflazz_trx_id: digiflazzResponse.trx_id,
        rc: digiflazzResponse.rc,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction_id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      transaction: digiflazzResponse 
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

// Mock Digiflazz API call (replace with actual implementation)
async function callDigiflazzAPI(params: any) {
  // In production, implement actual Digiflazz API call here
  // For now, return mock success response
  
  console.log('Mock Digiflazz API call:', params);
  
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    status: 'Sukses',
    message: 'Transaksi berhasil diproses',
    trx_id: `DGF${Date.now()}`,
    rc: '00',
    sn: Math.random().toString(36).substring(2, 15).toUpperCase(),
  };
}
