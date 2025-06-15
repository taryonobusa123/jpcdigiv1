
export async function fetchTransaction(supabase: any, transaction_id: string) {
  const { data: transaction, error } = await supabase
    .from('pulsa_transactions')
    .select('user_id')
    .eq('id', transaction_id)
    .single();
  return { transaction, error };
}

export async function updateTransactionStatus(
  supabase: any,
  transaction_id: string,
  status: string,
  message: string,
  data: { digiflazz_trx_id?: string; serial_number?: string }
) {
  const updateData: any = {
    status,
    message,
    updated_at: new Date().toISOString(),
    ...(data.digiflazz_trx_id && { digiflazz_trx_id: data.digiflazz_trx_id }),
    ...(data.serial_number && { serial_number: data.serial_number }),
  };

  const { data: updatedTransaction, error } = await supabase
    .from('pulsa_transactions')
    .update(updateData)
    .eq('id', transaction_id)
    .select()
    .single();

  return { updatedTransaction, error };
}

export async function updateUserBalance(
  supabase: any,
  user_id: string,
  price: number,
  sku: string,
  phone_number: string,
  transaction_id: string
) {
  const { error } = await supabase.rpc('update_user_balance', {
    p_user_id: user_id,
    p_amount: -price,
    p_type: 'purchase',
    p_description: `Pembelian pulsa ${sku} ke ${phone_number}`,
    p_transaction_id: transaction_id
  });
  return { error };
}
