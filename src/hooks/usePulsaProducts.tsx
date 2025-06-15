
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePulsaProducts(operator?: string) {
  return useQuery({
    queryKey: ['pulsa-products', operator],
    queryFn: async () => {
      console.log('Fetching pulsa products for operator:', operator);
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', 'pulsa')
        .eq('is_active', true)
        .order('buyer_price', { ascending: true });

      if (operator) {
        // Map operator names to brand names used in products table
        const brandMapping: { [key: string]: string } = {
          'TELKOMSEL': 'telkomsel',
          'INDOSAT': 'indosat',
          'XL': 'xl',
          'AXIS': 'axis',
          'TRI': 'tri',
          'THREE': 'tri',
          'SMARTFREN': 'smartfren'
        };
        
        const brand = brandMapping[operator] || operator.toLowerCase();
        query = query.eq('brand', brand);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching pulsa products:', error);
        throw error;
      }

      console.log('Fetched pulsa products:', data);
      return data;
    },
    enabled: true,
  });
}

export function usePulsaOperators() {
  return useQuery({
    queryKey: ['pulsa-operators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('brand')
        .eq('category', 'pulsa')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      // Get unique operators and map them back to display names
      const brands = [...new Set(data.map(item => item.brand))];
      const displayNames = brands.map(brand => {
        const displayMapping: { [key: string]: string } = {
          'telkomsel': 'TELKOMSEL',
          'indosat': 'INDOSAT',
          'xl': 'XL',
          'axis': 'AXIS',
          'tri': 'TRI',
          'smartfren': 'SMARTFREN'
        };
        return displayMapping[brand] || brand.toUpperCase();
      });
      
      return displayNames;
    },
  });
}
