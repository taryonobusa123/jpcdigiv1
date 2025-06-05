
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: {
      customer_id: string;
      sku: string;
      product_name: string;
      price: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Generate unique ref_id
      const ref_id = `TRX${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ref_id,
          customer_id: transaction.customer_id,
          sku: transaction.sku,
          product_name: transaction.product_name,
          price: transaction.price,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refreshProfile();
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dibuat",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
