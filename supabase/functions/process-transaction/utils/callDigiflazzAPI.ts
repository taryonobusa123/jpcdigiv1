
import { generateSignature } from './generateSignature.ts';

export async function callDigiflazzAPI(params: any) {
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
    console.log('Digiflazz API full response:', result);

    if (!result.data) {
      throw new Error(`Digiflazz API response missing 'data' field! ${JSON.stringify(result)}`);
    }
    return result;
  } catch (error) {
    console.error('Digiflazz API call failed:', error);
    throw error;
  }
}
