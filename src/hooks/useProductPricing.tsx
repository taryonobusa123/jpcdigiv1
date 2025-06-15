
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useUpdateProductPrice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      newBuyerPrice 
    }: { 
      productId: string; 
      newBuyerPrice: number;
    }) => {
      console.log('Updating product price:', productId, newBuyerPrice);

      const { error } = await supabase
        .from('products')
        .update({
          buyer_price: newBuyerPrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (error) {
        console.error('Error updating product price:', error);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Berhasil",
        description: "Harga produk berhasil diupdate",
      });
    },
    onError: (error) => {
      console.error('Product price update error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengupdate harga produk",
        variant: "destructive",
      });
    },
  });
}

export function useBatchUpdatePrices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      updates 
    }: { 
      updates: Array<{ id: string; buyer_price: number }>;
    }) => {
      console.log('Batch updating product prices:', updates.length, 'products');

      const promises = updates.map(update =>
        supabase
          .from('products')
          .update({
            buyer_price: update.buyer_price,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.id)
      );

      const results = await Promise.all(promises);
      
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} products`);
      }

      return { success: true, updated: updates.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Berhasil",
        description: `${data.updated} produk berhasil diupdate`,
      });
    },
    onError: (error) => {
      console.error('Batch update error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengupdate harga produk",
        variant: "destructive",
      });
    },
  });
}
