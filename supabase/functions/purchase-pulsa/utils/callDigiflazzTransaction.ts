
import { generateMD5Signature } from "./generateMD5Signature.ts";

export async function callDigiflazzTransaction(refId: string, phoneNumber: string, sku: string) {
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
    customer_no: phoneNumber,
    ref_id: refId,
    sign
  };
  console.log('Calling Digiflazz transaction API with payload:', {
    ...payload,
    sign: '***hidden***'
  });
  try {
    const response = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    console.log('Digiflazz raw response:', responseText);
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
    console.log('Digiflazz parsed response:', result);
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
          success: false,
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
    console.error('Digiflazz transaction API error:', error);
    return {
      success: false,
      message: 'Gagal menghubungi server provider. Silakan coba lagi.'
    };
  }
}
