
let CryptoJS: any;

export const loadCryptoJs = async () => {
  if (!CryptoJS) {
    CryptoJS = (await import('https://esm.sh/crypto-js@4.1.1')).default;
  }
  return CryptoJS;
};
