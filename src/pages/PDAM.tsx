
import React, { useState } from 'react';
import { ArrowLeft, Droplets, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePDAMCheck } from '@/hooks/usePDAMCheck';
import { usePDAMProducts } from '@/hooks/usePDAMProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PDAM = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerData, setCustomerData] = useState<any>(null);

  const { data: products, isLoading: isLoadingProducts, error: productError } = usePDAMProducts();
  const { mutate, isPending } = usePDAMCheck();

  // Filter hanya produk PDAM Sumedang (pascabayar/PDAM)
  const filteredProducts = products
    ? products.filter(
        (product: any) =>
          // filter berdasarkan kategori PDAM dan nama yang mengandung 'sumedang' (tidak case sensitive)
          (typeof product.product_name === 'string') &&
          product.product_name.toLowerCase().includes('sumedang')
      )
    : [];

  const handleCheck = () => {
    setCustomerData(null);
    if (!selectedProduct) return;
    mutate(
      { wilayah: selectedProduct.buyer_sku_code, nomorPelanggan: customerNumber },
      {
        onSuccess: (data: any) => {
          setCustomerData(data.data);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Droplets className="w-6 h-6" /> PDAM
          </h1>
        </div>
      </div>
      {/* Produk Wilayah */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Pilih Wilayah PDAM - Sumedang
          </h3>
          {isLoadingProducts && (
            <div className="text-gray-500 text-center">Memuat produk PDAM Sumedang...</div>
          )}
          {productError && (
            <div className="text-red-500 text-center">Gagal memuat produk PDAM</div>
          )}
          <div className="space-y-2 max-h-72 overflow-auto">
            {filteredProducts.length === 0 && !isLoadingProducts && (
              <div className="text-gray-500 text-center">Produk PDAM Sumedang tidak ditemukan.</div>
            )}
            {filteredProducts.map((product: any) => (
              <button
                key={product.buyer_sku_code}
                type="button"
                onClick={() => setSelectedProduct(product)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedProduct?.buyer_sku_code === product.buyer_sku_code
                    ? 'border-blue-500 bg-blue-50 font-bold'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{product.product_name}</span>
                  <span className="text-xs text-blue-500">{product.buyer_sku_code}</span>
                </div>
                <div className="text-gray-500 text-sm">{product.desc}</div>
              </button>
            ))}
          </div>
        </div>
        {selectedProduct && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nomor Pelanggan
            </h3>
            <Input
              type="text"
              value={customerNumber}
              onChange={e => setCustomerNumber(e.target.value)}
              placeholder="Masukkan nomor pelanggan"
              className="mb-3"
              disabled={isPending}
            />
            <Button
              className="w-full"
              onClick={handleCheck}
              disabled={!customerNumber || isPending}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Mengecek...
                </>
              ) : (
                <>
                  <Search className="mr-2 w-4 h-4" /> Cek Tagihan
                </>
              )}
            </Button>
            {customerData && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="font-bold text-gray-700 mb-1">
                  Nama: {customerData.customer_name || '-'}
                </div>
                <div className="text-gray-700 mb-1">
                  Wilayah: {selectedProduct.product_name}
                </div>
                <div className="text-gray-700 mb-1">
                  Nomor Pelanggan: {customerData.customer_number || customerNumber}
                </div>
                <div className="text-gray-700">
                  Tagihan: <b>Rp{customerData.amount ?? '-'}</b>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDAM;

