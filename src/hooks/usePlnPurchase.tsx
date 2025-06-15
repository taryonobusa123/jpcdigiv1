
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlnPurchaseData {
  customer_id: string;
  amount: number;
  admin_fee: number;
  customer_name: string;
}

export function usePlnPurchase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (purchaseData: PlnPurchaseData) => {
      console.log('Making PLN token purchase:', purchaseData);

      // Generate unique ref_id
      const ref_id = `PLN${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      const { data, error } = await supabase.functions.invoke('purchase-pln-token', {
        body: {
          ref_id,
          customer_id: purchaseData.customer_id,
          amount: purchaseData.amount,
          admin_fee: purchaseData.admin_fee,
          customer_name: purchaseData.customer_name,
        }
      });

      if (error) {
        console.error('PLN purchase error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal membeli token PLN');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Pembelian Berhasil",
        description: "Token PLN berhasil dibeli. Silakan cek riwayat transaksi.",
      });
    },
    onError: (error) => {
      console.error('PLN purchase error:', error);
      toast({
        title: "Pembelian Gagal",
        description: error.message || "Gagal membeli token PLN",
        variant: "destructive",
      });
    },
  });
}
