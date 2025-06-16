
import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type ArangOrder = {
  name: string;
  phone: string;
  address: string;
  quantity: number;
};

const ArangOrderForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<ArangOrder>();

  const onSubmit = async (data: ArangOrder) => {
    const { error } = await (supabase as any)
      .from('orders')
      .insert([
        {
          name: data.name,
          phone: data.phone,
          address: data.address,
          quantity: data.quantity,
          product: 'Arang Kayu', // Hardcoded for arang kayu order
        },
      ]);
    if (error) {
      toast({
        title: "Gagal memesan",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pesanan berhasil dikirim!",
        description: "Pesanan arang kayu Anda berhasil dibuat.",
      });
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-xl mx-auto animate-fade-in"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-2">Pesan Arang Kayu</h2>
      <div>
        <label className="font-medium text-sm text-gray-700">Nama</label>
        <Input
          placeholder="Nama Anda"
          {...register('name', { required: 'Nama wajib diisi' })}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="font-medium text-sm text-gray-700">No. HP</label>
        <Input
          placeholder="08xxxxxxxxxx"
          {...register('phone', { required: 'Nomor HP wajib diisi' })}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="font-medium text-sm text-gray-700">Alamat Pengiriman</label>
        <Textarea
          placeholder="Alamat lengkap"
          {...register('address', { required: 'Alamat wajib diisi' })}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium text-sm text-gray-700">Jumlah (kg)</label>
        <Input
          type="number"
          min={1}
          {...register('quantity', {
            required: 'Jumlah wajib diisi',
            min: { value: 1, message: 'Minimal 1 kg' },
          })}
        />
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Memproses...' : 'Pesan Sekarang'}
      </Button>
    </form>
  );
};

export default ArangOrderForm;
