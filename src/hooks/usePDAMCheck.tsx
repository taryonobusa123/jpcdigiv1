
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePDAMCheck() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      wilayah,
      nomorPelanggan,
    }: {
      wilayah: string;
      nomorPelanggan: string;
    }) => {
      // Asumsikan ada function 'check-pdam' di supabase/functions
      const { data, error } = await supabase.functions.invoke('check-pdam', {
        body: { region: wilayah, customer_number: nomorPelanggan },
      });

      if (error) {
        throw new Error('Gagal menghubungi server');
      }
      if (!data || !data.success) {
        throw new Error(data?.message || 'Gagal memeriksa nomor pelanggan');
      }

      return data;
    },
    onSuccess(data) {
      toast({
        title: "Berhasil",
        description: "Data pelanggan ditemukan: " + (data?.data?.customer_name || ""),
      });
    },
    onError(error: any) {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
