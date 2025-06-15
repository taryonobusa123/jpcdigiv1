
export async function generateMD5Signature(username: string, apiKey: string, refId: string): Promise<string> {
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
    for(let i = 0; i < text.length; i++){
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const fallbackHash = Math.abs(hash).toString(16);
    console.log('Using fallback hash');
    return fallbackHash;
  }
}
