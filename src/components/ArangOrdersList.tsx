
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  quantity: number;
  created_at: string;
};

const fetchArangOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from<any>('orders')
    .select('id,name,phone,address,quantity,created_at')
    .eq('product', 'Arang Kayu')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Order[] || [];
};

const ArangOrdersList: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', 'arang-kayu'],
    queryFn: fetchArangOrders,
    refetchInterval: 10000, // refresh setiap 10 detik (opsional)
  });

  if (isLoading) return <div className="text-center text-gray-400 p-4">Memuat data pesanan...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Gagal memuat pesanan.</div>;
  if (!data || data.length === 0)
    return <div className="text-center text-gray-500 p-4">Belum ada pesanan arang kayu.</div>;

  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-xl mx-auto mt-6">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Daftar Pemesanan Arang Kayu</h3>
      <div className="space-y-3">
        {data.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-3 hover:bg-blue-50 transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-700">{order.name}</span>
              <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600">No. HP: {order.phone}</div>
            <div className="text-sm text-gray-600">Alamat: {order.address}</div>
            <div className="text-sm text-gray-800 font-medium mt-1">Jumlah: {order.quantity} kg</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArangOrdersList;
