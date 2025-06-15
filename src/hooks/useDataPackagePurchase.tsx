
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useDataPackagePurchase() {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: {
      phone_number: string;
      operator: string;
      product_id: string;
      product_name: string;
      description: string;
      price: number;
      sku: string;
    }) => {
      if (!user) throw new Error('User tidak terautentikasi');

      console.log('Processing data package purchase:', transaction);

      // Generate unique ref_id
      const ref_id = `DATA${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      // Check user balance first
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (!profile || profile.balance < transaction.price) {
        throw new Error('Saldo tidak mencukupi');
      }

      // Create transaction record
      const { data: dataTransaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ref_id,
          phone_number: transaction.phone_number,
          operator: transaction.operator,
          product_name: transaction.product_name,
          description: transaction.description,
          amount: transaction.price,
          sku: transaction.sku,
          status: 'pending',
          type: 'data_package',
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        throw new Error('Gagal membuat transaksi');
      }

      // Process transaction via edge function
      const { data: result, error: processError } = await supabase.functions.invoke('process-transaction', {
        body: { 
          transaction_id: dataTransaction.id,
          ref_id,
          phone_number: transaction.phone_number,
          sku: transaction.sku,
          price: transaction.price
        }
      });

      if (processError) {
        console.error('Transaction processing error:', processError);
        throw new Error('Gagal memproses transaksi');
      }

      console.log('Purchase result:', result);

      return { transaction: dataTransaction, result };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refreshProfile();
      
      if (data.result?.success) {
        toast({
          title: "Berhasil",
          description: "Pembelian paket data berhasil",
        });
      } else {
        toast({
          title: "Transaksi Diproses",
          description: "Transaksi sedang diproses, silakan cek status transaksi",
        });
      }
    },
    onError: (error: Error) => {
      console.error('Data package purchase error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
