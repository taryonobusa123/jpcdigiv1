
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePlnMeterCheck() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (meterNumber: string) => {
      console.log('Checking PLN meter:', meterNumber);

      const { data, error } = await supabase.functions.invoke('check-pln-meter', {
        body: { meter_number: meterNumber }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Gagal menghubungi server');
      }

      console.log('PLN meter check response:', data);

      if (!data || !data.success) {
        throw new Error(data?.message || 'Gagal cek nomor meter');
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        toast({
          title: "Berhasil",
          description: `Data pelanggan ditemukan: ${data.data.customer_name}`,
        });
      }
    },
    onError: (error: Error) => {
      console.error('PLN meter check error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengecek nomor meter",
        variant: "destructive",
      });
    },
  });
}
