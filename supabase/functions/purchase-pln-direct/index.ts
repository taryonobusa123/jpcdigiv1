
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { transaction_id, ref_id, customer_id, sku, price } = await req.json();

    if (!transaction_id || !ref_id || !customer_id || !sku || !price) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Data transaksi tidak lengkap'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing PLN direct purchase:', { transaction_id, ref_id, customer_id, sku, price });

    // Get transaction details first
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('user_id')
      .eq('id', transaction_id)
      .single();

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
    const transactionResult = await callDigiflazzTransaction(ref_id, customer_id, sku);
    
    console.log('PLN Transaction result:', transactionResult);

    // Update transaction status in database
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update({
        status: transactionResult.success ? 'success' : 'failed',
        message: transactionResult.message,
        digiflazz_trx_id: transactionResult.digiflazz_trx_id,
        serial_number: transactionResult.serial_number,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating transaction:', updateError);
    }

    // If transaction successful, update user balance
    if (transactionResult.success) {
      // Deduct balance from user
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        p_user_id: transaction.user_id,
        p_amount: -price,
        p_type: 'purchase',
        p_description: `Pembelian token PLN ${sku} untuk meter ${customer_id}`,
        p_transaction_id: transaction_id
      });

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
    console.error('PLN direct purchase error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      message: 'Terjadi kesalahan sistem'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callDigiflazzTransaction(refId: string, customerId: string, sku: string) {
  const username = Deno.env.get('DIGIFLAZZ_USERNAME');
  const apiKey = Deno.env.get('DIGIFLAZZ_API_KEY');
  
  if (!username || !apiKey) {
    console.error('Digiflazz credentials not configured');
    return {
      success: false,
      message: 'Konfigurasi API tidak lengkap. Silakan hubungi administrator.'
    };
  }

  // Generate signature using MD5
  const sign = await generateMD5Signature(username, apiKey, refId);
  
  const payload = {
    username,
    buyer_sku_code: sku,
    customer_no: customerId,
    ref_id: refId,
    sign,
  };

  console.log('Calling Digiflazz PLN transaction API with payload:', {
    ...payload,
    sign: '***hidden***'
  });

  try {
    const response = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Digiflazz PLN raw response:', responseText);
    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return {
        success: false,
        message: `Server error: ${response.status}`
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return {
        success: false,
        message: 'Format respons server tidak valid'
      };
    }

    console.log('Digiflazz PLN parsed response:', result);
    
    // Check specific error messages
    if (result.data) {
      // Check for IP whitelist error
      if (result.data.message && result.data.message.includes('IP Anda tidak kami kenali')) {
        return {
          success: false,
          message: 'IP server belum terdaftar di Digiflazz. Silakan hubungi administrator untuk menambahkan IP ke whitelist.'
        };
      }
      
      // Check for other errors
      if (result.data.status === 'Gagal') {
        return {
          success: false,
          message: result.data.message || 'Transaksi gagal'
        };
      }
      
      // Check if transaction was successful
      if (result.data.status === 'Sukses') {
        return {
          success: true,
          message: 'Transaksi berhasil',
          digiflazz_trx_id: result.data.trx_id,
          serial_number: result.data.sn
        };
      }
      
      // Handle pending status
      if (result.data.status === 'Pending') {
        return {
          success: false, // We'll mark as false for now, webhook will update later
          message: 'Transaksi sedang diproses',
          digiflazz_trx_id: result.data.trx_id
        };
      }
    }
    
    return {
      success: false,
      message: result.message || 'Status transaksi tidak diketahui'
    };
  } catch (error) {
    console.error('Digiflazz PLN transaction API error:', error);
    return {
      success: false,
      message: 'Gagal menghubungi server provider. Silakan coba lagi.'
    };
  }
}

async function generateMD5Signature(username: string, apiKey: string, refId: string): Promise<string> {
  const text = username + apiKey + refId;
  
  try {
    const { default: CryptoJS } = await import('https://esm.sh/crypto-js@4.1.1');
    const hash = CryptoJS.MD5(text).toString();
    
    console.log('Generated MD5 signature successfully');
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
    console.log('Using fallback hash');
    return fallbackHash;
  }
}
