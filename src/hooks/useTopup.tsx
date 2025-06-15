
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

      // Generate random 3-digit number for identification
      const randomId = Math.floor(100 + Math.random() * 900);
      const finalAmount = data.amount + randomId;

      const { data: result, error } = await supabase
        .from('topup_requests')
        .insert({
          user_id: user.id,
          amount: finalAmount,
          payment_method: data.payment_method,
          proof_image: data.proof_image,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return { ...result, randomId, originalAmount: data.amount };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['topup-requests'] });
      toast({
        title: "Berhasil",
        description: `Permintaan top up berhasil dikirim. Transfer sebesar ${new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(result.amount)} (termasuk kode unik +${result.randomId}). Menunggu konfirmasi admin.`,
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
