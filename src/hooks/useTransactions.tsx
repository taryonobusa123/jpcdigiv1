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

      // Fetch regular transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch pulsa transactions
      const { data: pulsaTransactions, error: pulsaError } = await supabase
        .from('pulsa_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (pulsaError) throw pulsaError;

      // Logging fetched data for debugging
      console.log("Fetched transactions:", transactions);
      console.log("Fetched pulsa transactions:", pulsaTransactions);

      // Combine and format all transactions
      const allTransactions = [
        ...(transactions || []).map(tx => ({
          id: tx.id,
          type: tx.product_name,
          category: 'general',
          amount: `-Rp ${tx.price?.toLocaleString('id-ID')}`,
          status: tx.status || 'pending',
          date: new Date(tx.created_at || '').toLocaleDateString('id-ID'),
          time: new Date(tx.created_at || '').toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          description: tx.customer_id,
          ref_id: tx.ref_id,
          serial_number: tx.serial_number,
          message: tx.message
        })),
        ...(pulsaTransactions || []).map(tx => ({
          id: tx.id,
          type: tx.product_name,
          category: 'pulsa',
          amount: `-Rp ${tx.price?.toLocaleString('id-ID')}`,
          status: tx.status || 'pending',
          date: new Date(tx.created_at || '').toLocaleDateString('id-ID'),
          time: new Date(tx.created_at || '').toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          description: tx.phone_number,
          ref_id: tx.ref_id,
          serial_number: tx.serial_number,
          message: tx.message
        }))
      ];

      // Cek isi array gabungan sebelum sorting
      console.log("All transactions combined:", allTransactions);

      // Sort by created_at descending
      allTransactions.sort((a, b) => 
        new Date(b.date + ' ' + b.time).getTime() - 
        new Date(a.date + ' ' + a.time).getTime()
      );

      return allTransactions;
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

      // Process transaction via edge function
      const { error: processError } = await supabase.functions.invoke('process-transaction', {
        body: { transaction_id: data.id }
      });

      if (processError) {
        console.error('Transaction processing error:', processError);
        // Transaction was created but processing failed
        // The transaction will remain in pending status
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refreshProfile();
      toast({
        title: "Berhasil",
        description: "Transaksi sedang diproses",
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
