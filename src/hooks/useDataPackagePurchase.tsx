import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useDataPackagePurchase() {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: {
      phone_number: string;
      operator: string;
      product_id: string;
      product_name: string;
      description: string;
      price: number;
      sku: string;
    }) => {
      if (!user) throw new Error('User tidak terautentikasi');

      // VALIDASI DATA
      if (!transaction.phone_number || !transaction.product_name || !transaction.sku) {
        throw new Error('Pastikan nomor, produk dan SKU terisi');
      }

      console.log('Processing data package purchase:', transaction);

      // Generate unique ref_id
      const ref_id = `DATA${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      // Check user balance first
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (!profile || profile.balance < transaction.price) {
        throw new Error('Saldo tidak mencukupi');
      }

      // Create transaction record
      const { data: dataTransaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ref_id,
          customer_id: transaction.phone_number, // Field ini WAJIB ADA
          product_name: transaction.product_name,
          price: transaction.price,
          status: 'pending',
          sku: transaction.sku,
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        throw new Error('Gagal membuat transaksi');
      }

      // Pastikan dataTransaction dan field penting tidak null
      if (!dataTransaction?.id || !dataTransaction.customer_id) {
        throw new Error('Gagal mendapatkan data transaksi');
      }

      // Log: Payload untuk proses transaksi Edge Function
      console.log('Payload ke Edge Function:', {
        transaction_id: dataTransaction.id,
        ref_id: ref_id,
        customer_id: transaction.phone_number,
        sku: transaction.sku,
        price: transaction.price,
      });

      // Process transaction via edge function
      const { data: result, error: processError } = await supabase.functions.invoke('process-transaction', {
        body: { 
          transaction_id: dataTransaction.id,
          ref_id,
          customer_id: transaction.phone_number,
          sku: transaction.sku,
          price: transaction.price
        }
      });

      // Error handling detail
      if (processError) {
        // Jika ada detail error dari backend, tampilkan
        let friendlyError = 'Gagal memproses transaksi';
        if (typeof processError === "object") {
          if (processError.message) {
            friendlyError = processError.message;
          } else if (processError.error || processError.detail) {
            friendlyError = `${processError.error || ''}: ${processError.detail || ''}`;
          }
        }
        // Coba ambil dari data error juga
        if (result?.error) {
          friendlyError += `: ${result.error}`;
        }
        if (result?.detail) {
          friendlyError += ` (${result.detail})`;
        }

        console.error('Transaction processing error:', processError, 'Result:', result);
        throw new Error(friendlyError);
      }

      // Tangkap error dari Edge Function non-2xx status dengan isi message supaya user tahu alasan error
      if (result && result.error) {
        let errMsg = result.error;
        if (result?.detail) {
          errMsg += `: ${result.detail}`;
        }
        throw new Error(errMsg);
      }

      console.log('Purchase result:', result);

      return { transaction: dataTransaction, result };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refreshProfile();
      
      if (data?.result?.success) {
        toast({
          title: "Berhasil",
          description: "Pembelian paket data berhasil",
        });
      } else {
        toast({
          title: "Transaksi Diproses",
          description: "Transaksi sedang diproses, silakan cek status transaksi",
        });
      }
    },
    onError: (error: Error & { message?: string; }) => {
      // Perbaiki agar pesan error yang detail selalu muncul
      console.error('Data package purchase error:', error);
      toast({
        title: "Error",
        description: error.message || String(error),
        variant: "destructive",
      });
    },
  });
}
