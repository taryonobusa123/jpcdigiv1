
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('brand', { ascending: true })
        .order('buyer_price', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    },
  });
}
