
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSyncProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting product sync...');

      const { data, error } = await supabase.functions.invoke('sync-products', {
        body: {}
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Sync failed');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      
      const message = data.error_count > 0 
        ? `Synced ${data.synced_count} products (${data.error_count} errors)` 
        : `Successfully synced ${data.synced_count} products from Digiflazz`;
        
      toast({
        title: "Sync Complete",
        description: message,
        variant: data.error_count > 0 ? "default" : "default",
      });
    },
    onError: (error) => {
      console.error('Product sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync products from Digiflazz",
        variant: "destructive",
      });
    },
  });
}
