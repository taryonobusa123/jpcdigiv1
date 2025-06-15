
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
      
      // Return the product ID and new price for cache updating
      return {
        id: productId,
        buyer_price: newBuyerPrice,
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: (updatedData) => {
      // Force invalidate and refetch all product queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
      
      // Update the cache immediately with the new data - with proper null checks
      queryClient.setQueryData(['products', 'all'], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData) || !updatedData) {
          return oldData;
        }
        
        return oldData.map((product: any) => {
          if (!product || !product.id) {
            return product;
          }
          
          return product.id === updatedData.id 
            ? { ...product, buyer_price: updatedData.buyer_price, updated_at: updatedData.updated_at }
            : product;
        });
      });
      
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

      // First, check which products exist
      const productIds = updates.map(update => update.id);
      const { data: existingProducts, error: checkError } = await supabase
        .from('products')
        .select('id')
        .in('id', productIds);

      if (checkError) {
        console.error('Error checking existing products:', checkError);
        throw checkError;
      }

      const existingIds = new Set(existingProducts?.map(p => p.id) || []);
      const validUpdates = updates.filter(update => existingIds.has(update.id));
      const invalidIds = updates.filter(update => !existingIds.has(update.id)).map(u => u.id);

      if (invalidIds.length > 0) {
        console.warn('Products not found:', invalidIds);
      }

      if (validUpdates.length === 0) {
        throw new Error('Tidak ada produk valid untuk diupdate');
      }

      console.log('Valid updates:', validUpdates.length, 'Invalid:', invalidIds.length);

      // Use Promise.allSettled for better error handling
      const results = await Promise.allSettled(
        validUpdates.map(async (update) => {
          console.log('Updating product:', update.id, 'with price:', update.buyer_price);
          
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

          console.log('Successfully updated product:', update.id, data);
          return {
            id: update.id,
            buyer_price: update.buyer_price,
            updated_at: new Date().toISOString()
          };
        })
      );

      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');
      const successfulUpdates = successful.map(result => 
        result.status === 'fulfilled' ? result.value : null
      ).filter(Boolean);

      console.log('Batch update results:', {
        total: updates.length,
        validProducts: validUpdates.length,
        successful: successful.length,
        failed: failed.length,
        invalidProducts: invalidIds.length
      });

      if (failed.length > 0) {
        console.error('Failed updates:', failed);
      }

      return { 
        success: true, 
        updated: successful.length, 
        failed: failed.length,
        total: updates.length,
        invalid: invalidIds.length,
        updatedProducts: successfulUpdates
      };
    },
    onSuccess: (data) => {
      console.log('Batch update completed, invalidating queries...');
      
      // Force complete refresh of products data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // Update cache with new data if available - with proper null checks
      if (data.updatedProducts && data.updatedProducts.length > 0) {
        queryClient.setQueryData(['products', 'all'], (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) {
            return oldData;
          }
          
          return oldData.map((product: any) => {
            if (!product || !product.id) {
              return product;
            }
            
            const updatedProduct = data.updatedProducts.find((p: any) => p && p.id === product.id);
            return updatedProduct ? { ...product, ...updatedProduct } : product;
          });
        });
      }
      
      const message = data.invalid > 0 
        ? `${data.updated} produk berhasil diupdate, ${data.failed} gagal, ${data.invalid} produk tidak ditemukan`
        : data.failed > 0 
          ? `${data.updated} produk berhasil diupdate, ${data.failed} gagal`
          : `${data.updated} produk berhasil diupdate`;
      
      toast({
        title: "Berhasil",
        description: message,
        variant: data.failed > 0 ? "destructive" : "default",
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
