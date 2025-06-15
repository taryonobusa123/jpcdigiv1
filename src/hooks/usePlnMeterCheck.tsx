
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
      
      // Provide specific error messages based on the error
      let errorMessage = error.message;
      
      if (errorMessage.includes('IP server belum terdaftar')) {
        errorMessage = 'IP server belum terdaftar di Digiflazz. Silakan hubungi administrator.';
      } else if (errorMessage.includes('tidak kami kenali')) {
        errorMessage = 'Server belum terdaftar di sistem provider. Silakan hubungi administrator.';
      } else if (errorMessage.includes('Gagal menghubungi server')) {
        errorMessage = 'Gagal menghubungi server. Silakan coba lagi.';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}
