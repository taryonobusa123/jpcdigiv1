
import { loadCryptoJs } from './loadCryptoJs.ts';

export async function generateSignature(username: string, apiKey: string, refId: string): Promise<string> {
  const CryptoJS = await loadCryptoJs();
  const text = username + apiKey + refId;
  try {
    const hash = CryptoJS.MD5(text).toString();
    console.log('Generated MD5 signature successfully');
    return hash;
  } catch (error) {
    console.error('Error generating MD5 signature:', error);
    return '';
  }
}
