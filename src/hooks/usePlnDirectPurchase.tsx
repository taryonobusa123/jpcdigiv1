
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PlnDirectPurchaseData {
  meter_number: string;
  product_id: string;
  product_name: string;
  price: number;
  sku: string;
}

export function usePlnDirectPurchase() {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (purchaseData: PlnDirectPurchaseData) => {
      if (!user) throw new Error('User tidak terautentikasi');

      console.log('Processing PLN direct purchase:', purchaseData);

      // Generate unique ref_id
      const ref_id = `PLN${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      // Check user balance first
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (!profile || profile.balance < purchaseData.price) {
        throw new Error('Saldo tidak mencukupi');
      }

      // Create transaction record in pln_transactions table
      const { data: plnTransaction, error: transactionError } = await supabase
        .from('pln_transactions')
        .insert({
          user_id: user.id,
          ref_id,
          customer_id: purchaseData.meter_number,
          product_name: purchaseData.product_name,
          price: purchaseData.price,
          sku: purchaseData.sku,
          status: 'pending',
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating PLN transaction:', transactionError);
        throw new Error('Gagal membuat transaksi');
      }

      // Process transaction via edge function
      const { data: result, error: processError } = await supabase.functions.invoke('purchase-pln-direct', {
        body: { 
          transaction_id: plnTransaction.id,
          ref_id,
          customer_id: purchaseData.meter_number,
          sku: purchaseData.sku,
          price: purchaseData.price
        }
      });

      if (processError) {
        console.error('PLN transaction processing error:', processError);
        throw new Error('Gagal memproses transaksi');
      }

      console.log('PLN purchase result:', result);

      return { transaction: plnTransaction, result };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pln-transactions'] });
      refreshProfile();
      
      // Navigate to transaction detail page
      navigate(`/transaction-detail/${data.transaction.id}`);
      
      if (data.result?.success) {
        toast({
          title: "Berhasil",
          description: "Pembelian token PLN berhasil",
        });
      } else {
        toast({
          title: "Transaksi Diproses",
          description: "Transaksi sedang diproses, silakan cek status transaksi",
        });
      }
    },
    onError: (error: Error) => {
      console.error('PLN direct purchase error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
