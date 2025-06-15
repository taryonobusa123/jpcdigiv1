
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

      // Create transaction record in transactions table
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
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

      console.log('Transaction created successfully:', transaction);

      // Try to process transaction via edge function
      try {
        const { data: result, error: processError } = await supabase.functions.invoke('purchase-pln-direct', {
          body: { 
            transaction_id: transaction.id,
            ref_id,
            customer_id: purchaseData.meter_number,
            sku: purchaseData.sku,
            price: purchaseData.price
          }
        });

        if (processError) {
          console.error('PLN transaction processing error:', processError);
          
          // Update transaction status to failed
          await supabase
            .from('transactions')
            .update({ 
              status: 'failed',
              message: 'Gagal memproses ke provider'
            })
            .eq('id', transaction.id);
          
          throw new Error('Gagal memproses transaksi ke provider');
        }

        console.log('PLN purchase result:', result);
        return { transaction, result };
        
      } catch (functionError) {
        console.error('Edge function call failed:', functionError);
        
        // Update transaction status to failed  
        await supabase
          .from('transactions')
          .update({ 
            status: 'failed',
            message: 'Server sedang bermasalah, silakan coba lagi'
          })
          .eq('id', transaction.id);
        
        throw new Error('Server sedang bermasalah, silakan coba lagi nanti');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refreshProfile();
      
      // Navigate to transaction detail page
      navigate(`/transaction-detail/${data.transaction.id}`);
      
      if (data.result?.success) {
        toast({
          title: "Berhasil",
          description: "Pembelian token PLN berhasil diproses",
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
