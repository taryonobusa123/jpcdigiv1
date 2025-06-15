
export function validateInput(body: any) {
  const { transaction_id, ref_id, customer_id, sku, price } = body;
  if (!transaction_id || !ref_id || !customer_id || !sku || !price) {
    return {
      valid: false,
      message: 'Data transaksi tidak lengkap'
    };
  }
  return { valid: true };
}
