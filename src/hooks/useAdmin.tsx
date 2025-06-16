
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAdminTransactions() {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles!inner(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAdminTopupRequests() {
  return useQuery({
    queryKey: ['admin-topup-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topup_requests')
        .select(`
          *,
          profiles!inner(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateTopupRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      adminNotes 
    }: { 
      id: string; 
      status: string; 
      adminNotes?: string;
    }) => {
      const { data: request, error: fetchError } = await supabase
        .from('topup_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Update topup request status
      const { error: updateError } = await supabase
        .from('topup_requests')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // If approved, update user balance
      if (status === 'approved') {
        const { error: balanceError } = await supabase.rpc('update_user_balance', {
          p_user_id: request.user_id,
          p_amount: request.amount,
          p_type: 'topup',
          p_description: `Top up via ${request.payment_method}`,
        });

        if (balanceError) throw balanceError;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-topup-requests'] });
      toast({
        title: "Berhasil",
        description: "Status top up berhasil diupdate",
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

export function useRefundTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: any) => {
      // Check if already refunded
      if (transaction.is_refunded) {
        throw new Error('Transaction already refunded');
      }

      // Refund the balance to user
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        p_user_id: transaction.user_id,
        p_amount: transaction.price,
        p_type: 'refund',
        p_description: `Refund untuk transaksi gagal ${transaction.ref_id}`,
        p_transaction_id: transaction.id,
      });

      if (balanceError) throw balanceError;

      // Mark transaction as refunded
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          is_refunded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      if (updateError) throw updateError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      toast({
        title: "Berhasil",
        description: "Saldo berhasil dikembalikan ke pelanggan",
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

export function useSyncProducts() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-products');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Berhasil",
        description: `${data.synced_count} produk berhasil disinkronisasi`,
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

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get transaction stats
      const { data: transactionStats, error: transactionError } = await supabase
        .from('transactions')
        .select('status, price')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (transactionError) throw transactionError;

      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Calculate stats
      const totalTransactions = transactionStats.length;
      const successfulTransactions = transactionStats.filter(t => t.status === 'Sukses').length;
      const totalRevenue = transactionStats
        .filter(t => t.status === 'Sukses')
        .reduce((sum, t) => sum + parseFloat(t.price.toString()), 0);

      return {
        totalUsers: userCount || 0,
        totalTransactions,
        successfulTransactions,
        totalRevenue,
        successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0,
      };
    },
  });
}
