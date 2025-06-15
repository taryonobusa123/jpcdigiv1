
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDataPackages(operator?: string) {
  return useQuery({
    queryKey: ['data-packages', operator],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', 'Data')
        .eq('is_active', true)
        .order('buyer_price', { ascending: true });

      if (operator) {
        query = query.eq('brand', operator);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
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
        .eq('category', 'Data')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      // Get unique operators
      const operators = [...new Set(data.map(item => item.brand))];
      return operators;
    },
  });
}
