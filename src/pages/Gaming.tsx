
import React, { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
// Tambahkan import TransactionModal
import TransactionModal from '@/components/TransactionModal';

const Gaming = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  // State untuk modal transaksi
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: products, isLoading, error } = useProducts('gaming');

  // Ambil semua brand unik dari produk
  const gameBrands = useMemo(() => {
    if (!products) return [];
    const uniqueBrands = Array.from(
      new Set(
        products
          .filter((p) => !!p.brand)
          .map((p) => p.brand.trim())
      )
    );
    return uniqueBrands;
  }, [products]);

  // Filter by brand
  const filteredByBrand = useMemo(() => {
    if (!products) return [];
    if (selectedBrand === 'all') return products;
    return products.filter((p) => p.brand === selectedBrand);
  }, [products, selectedBrand]);

  // Filter by search
  const filteredProducts =
    filteredByBrand?.filter(
      (product) =>
        product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  // ====== MOBILE UI ======
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-3 shadow">
          <div className="flex items-center space-x-3 mb-2">
            <a href="/" className="p-2 hover:bg-white/20 rounded-lg">
              <svg width="22" height="22" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <h1 className="text-lg font-bold">Voucher Gaming</h1>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            {/* Dropdown Brand */}
            <select
              className="flex-1 text-gray-800 rounded-lg py-2 px-2 focus:outline-none text-xs"
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
            >
              <option value="all">Semua Brand</option>
              {gameBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari game..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-2 py-2 text-xs bg-white rounded-lg w-full"
              />
            </div>
          </div>
        </div>
        <div className="p-2">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-3 animate-pulse h-32" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 text-sm">Gagal memuat produk gaming</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">Tidak ada produk gaming ditemukan</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow p-2 flex flex-col justify-between h-32"
                >
                  <div>
                    <div className="flex items-center mb-1 gap-1">
                      <Badge variant="outline" className="text-[10px] px-1 mr-1">{product.brand}</Badge>
                      <Badge variant="outline" className="text-[10px] px-1">{product.type}</Badge>
                    </div>
                    <div className="font-medium text-gray-800 text-xs truncate">{product.product_name}</div>
                    <div className="text-[10px] text-gray-400 mb-1 line-clamp-2">{product.description}</div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-blue-600 font-bold text-xs">{formatPrice(product.buyer_price)}</span>
                    <Button
                      size="sm"
                      className="text-xs px-2 py-1 h-7 rounded-md"
                      onClick={() => {
                        setSelectedProduct(product);
                        setModalOpen(true);
                      }}
                    >
                      Beli
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Modal transaksi */}
        <TransactionModal
          product={selectedProduct}
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setSelectedProduct(null);
          }}
        />
        <BottomNavigation />
      </div>
    );
  }

  // ====== DESKTOP UI ======
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <a href="/" className="p-2 hover:bg-white/20 rounded-lg">
            <svg width="20" height="20" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <h1 className="text-xl font-bold">Voucher Gaming</h1>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-2 md:space-y-0 mb-2">
          <div>
            {/* Dropdown Brand */}
            <select
              className="w-full md:w-auto text-gray-800 rounded-lg py-2 px-3 focus:outline-none"
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
            >
              <option value="all">Semua Brand</option>
              {gameBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
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
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalOpen(true);
                    }}
                  >
                    Beli
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal transaksi */}
      <TransactionModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      />
      <BottomNavigation />
    </div>
  );
};

export default Gaming;
