
import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';

const Gaming = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products, isLoading, error } = useProducts('gaming');

  // Filter by search query (name, brand)
  const filteredProducts = products?.filter(product =>
    product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <a href="/" className="p-2 hover:bg-white/20 rounded-lg">
            <svg width="20" height="20" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <h1 className="text-xl font-bold">Voucher Gaming</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari produk gaming..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Gagal memuat produk gaming</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Tidak ada produk gaming ditemukan</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product: any) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-2">{product.brand}</Badge>
                    <Badge variant="outline">{product.type}</Badge>
                  </div>
                  <div className="font-semibold text-gray-800 text-sm">{product.product_name}</div>
                  <div className="text-xs text-gray-500 line-clamp-2 mb-2">{product.description}</div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-blue-600 font-bold text-base">{formatPrice(product.buyer_price)}</span>
                  <Button size="sm" className="text-xs">Beli</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Gaming;

