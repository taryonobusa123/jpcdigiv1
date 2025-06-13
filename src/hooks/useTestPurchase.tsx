
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTestPurchase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: {
      sku: string;
      customer_id: string;
      product_name: string;
      price: number;
    }) => {
      // Generate unique ref_id for test
      const ref_id = `TEST${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      console.log('Making test purchase:', {
        ref_id,
        customer_id: transaction.customer_id,
        sku: transaction.sku,
        product_name: transaction.product_name,
        price: transaction.price,
      });

      // Call edge function to make real Digiflazz transaction
      const { data, error } = await supabase.functions.invoke('test-digiflazz-transaction', {
        body: {
          ref_id,
          customer_id: transaction.customer_id,
          sku: transaction.sku,
          product_name: transaction.product_name,
          price: transaction.price,
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digiflazz-transactions'] });
      toast({
        title: "Success",
        description: "Test transaction submitted successfully",
      });
    },
    onError: (error) => {
      console.error('Test purchase error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit test transaction",
        variant: "destructive",
      });
    },
  });
}

export function useDigiflazzTransactions() {
  return useQuery({
    queryKey: ['digiflazz-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transaksi_digiflazz')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
