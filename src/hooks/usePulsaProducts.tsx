
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePulsaProducts(operator?: string) {
  return useQuery({
    queryKey: ['pulsa-products', operator],
    queryFn: async () => {
      let query = supabase
        .from('pulsa_products')
        .select('*')
        .eq('is_active', true)
        .order('nominal', { ascending: true });

      if (operator) {
        query = query.eq('operator', operator);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

export function usePulsaOperators() {
  return useQuery({
    queryKey: ['pulsa-operators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pulsa_products')
        .select('operator')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      // Get unique operators
      const operators = [...new Set(data.map(item => item.operator))];
      return operators;
    },
  });
}
