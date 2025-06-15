
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

const fetchEwalletProducts = async (): Promise<any[]> => {
  // Contoh panggil Supabase Edge function untuk proxy Digiflazz (ganti sesuai implementasi backend)
  try {
    const response = await fetch('/functions/v1/ewallet-products', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.data; // fallback untuk format
  } catch (error) {
    console.error(error);
    return [];
  }
};

const EWalletTransaksi = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchEwalletProducts();
      // filter produk dengan category = "E-Money" saja
      const ewallets = data.filter((item) =>
        (item.category || '').toLowerCase().includes('e-money')
      );
      setProducts(ewallets);
      setLoading(false);
    };
    load();
  }, []);

  const handleTransaksi = (product: any) => {
    alert(`Transaksi ewallet akan dibuat untuk produk: ${product.product_name} (${product.buyer_sku_code})`);
    // Bisa dialihkan ke halaman detail/form transaksi sesuai kebutuhan aplikasi
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Wallet className="w-7 h-7 text-purple-600" /> Transaksi E-Wallet
        </h1>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Memuat produk e-wallet dari Digiflazz...</div>
        ) : (
          <>
            {products.length === 0 && (
              <div className="text-center text-muted-foreground">Tidak ada produk e-wallet tersedia.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.buyer_sku_code} className="relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{product.product_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">{product.brand}</Badge>
                        <Badge>{product.category}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">{product.desc}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="font-semibold text-blue-600 text-lg">
                          Rp{(Number(product.price || 0)).toLocaleString('id-ID')}
                        </div>
                        <Button size="sm" onClick={() => handleTransaksi(product)}>
                          Beli
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EWalletTransaksi;

