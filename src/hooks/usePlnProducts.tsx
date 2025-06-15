
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePlnProducts() {
  return useQuery({
    queryKey: ['pln-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'electricity')
        .eq('is_active', true)
        .order('buyer_price', { ascending: true });
      
      if (error) {
        console.error('Error fetching PLN products:', error);
        throw error;
      }
      
      return data;
    },
  });
}
