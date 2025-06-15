
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
        console.error('PLN meter check error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal cek nomor meter');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Berhasil",
        description: `Data pelanggan ditemukan: ${data.data.customer_name}`,
      });
    },
    onError: (error) => {
      console.error('PLN meter check error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengecek nomor meter",
        variant: "destructive",
      });
    },
  });
}
