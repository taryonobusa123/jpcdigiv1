
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePDAMProducts() {
  return useQuery({
    queryKey: ['pdam-products'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('pdam-products');
      if (error) throw new Error('Gagal menghubungi server');
      if (!data || !data.success) throw new Error(data?.message || 'Gagal fetch produk PDAM');
      // data.products: array produk PDAM dari Digiflazz
      return data.products;
    },
  });
}
