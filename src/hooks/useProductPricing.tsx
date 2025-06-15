
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

      const { data, error } = await supabase
        .from('products')
        .update({
          buyer_price: newBuyerPrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select();

      if (error) {
        console.error('Error updating product price:', error);
        throw error;
      }

      console.log('Product price updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate multiple query keys to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', undefined] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      
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

      const promises = updates.map(async (update) => {
        const { data, error } = await supabase
          .from('products')
          .update({
            buyer_price: update.buyer_price,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.id)
          .select();

        if (error) {
          console.error('Error updating product:', update.id, error);
          throw error;
        }

        return data;
      });

      const results = await Promise.all(promises);
      console.log('Batch update completed:', results);
      
      return { success: true, updated: updates.length };
    },
    onSuccess: (data) => {
      // Invalidate multiple query keys to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', undefined] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      
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
