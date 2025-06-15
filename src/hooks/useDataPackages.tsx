
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDataPackages(operator?: string) {
  return useQuery({
    queryKey: ['data-packages', operator],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', 'data')
        .eq('is_active', true)
        .order('buyer_price', { ascending: true });

      if (operator) {
        query = query.eq('brand', operator);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching data packages:', error);
        throw error;
      }

      console.log('Fetched data packages:', data?.length || 0);
      return data || [];
    },
  });
}

export function useDataOperators() {
  return useQuery({
    queryKey: ['data-operators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('brand')
        .eq('category', 'data')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching data operators:', error);
        throw error;
      }

      // Get unique operators
      const operators = [...new Set(data?.map(item => item.brand) || [])];
      console.log('Available data operators:', operators);
      return operators;
    },
  });
}
