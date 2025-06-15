
export function validateInput(body: any) {
  const { transaction_id, ref_id, phone_number, sku, price } = body;
  if (!transaction_id || !ref_id || !phone_number || !sku || !price) {
    return {
      valid: false,
      message: 'Data transaksi tidak lengkap'
    };
  }
  return { valid: true };
}
