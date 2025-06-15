
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function usePulsaPurchase() {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (transaction: {
      phone_number: string;
      operator: string;
      product_id: string;
      product_name: string;
      nominal: number;
      price: number;
      sku: string;
    }) => {
      if (!user) throw new Error('User tidak terautentikasi');

      console.log('Processing pulsa purchase:', transaction);

      // Generate unique ref_id
      const ref_id = `PULSA${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      // Check user balance first
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (!profile || profile.balance < transaction.price) {
        throw new Error('Saldo tidak mencukupi');
      }

      // Create transaction record in 'transactions' table
      const { data: trx, error: trxError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ref_id,
          customer_id: transaction.phone_number,
          sku: transaction.sku,
          product_name: transaction.product_name,
          price: transaction.price,
          status: 'pending',
        })
        .select()
        .single();

      if (trxError) {
        console.error('Error creating transaction:', trxError);
        throw new Error('Gagal membuat transaksi');
      }

      // Process transaction via edge function (will call Digiflazz)
      const { data: result, error: processError } = await supabase.functions.invoke('process-transaction', {
        body: {
          transaction_id: trx.id
        }
      });

      if (processError) {
        console.error('Transaction processing error:', processError);
        throw new Error('Gagal memproses transaksi');
      }

      console.log('Purchase result:', result);

      return { transaction: trx, result };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refreshProfile();

      // Navigate to transaction detail page
      navigate(`/transaction-detail/${data.transaction.id}`);

      if (data.result?.success) {
        toast({
          title: "Berhasil",
          description: "Pembelian pulsa berhasil",
        });
      } else {
        toast({
          title: "Transaksi Diproses",
          description: "Transaksi sedang diproses, silakan cek status transaksi",
        });
      }
    },
    onError: (error: Error) => {
      console.error('Pulsa purchase error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

