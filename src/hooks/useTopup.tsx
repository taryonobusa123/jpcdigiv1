
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useCreateTopupRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      amount: number;
      payment_method: string;
      proof_image?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: result, error } = await supabase
        .from('topup_requests')
        .insert({
          user_id: user.id,
          amount: data.amount,
          payment_method: data.payment_method,
          proof_image: data.proof_image,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topup-requests'] });
      toast({
        title: "Berhasil",
        description: "Permintaan top up berhasil dikirim. Menunggu konfirmasi admin.",
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
