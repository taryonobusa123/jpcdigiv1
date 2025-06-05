
import React, { useState } from 'react';
import { useProducts, useProductCategories } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import ProductCard from '@/components/ProductCard';
import TransactionModal from '@/components/TransactionModal';
import AuthModal from '@/components/AuthModal';
import UserBalanceCard from '@/components/UserBalanceCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  brand: string;
  type: string;
  buyer_price: number;
  description: string;
}

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts(selectedCategory);
  const { data: categories } = useProductCategories();

  const filteredProducts = products?.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleBuyProduct = (product: Product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedProduct(product);
    setShowTransactionModal(true);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'pulsa': return 'Pulsa';
      case 'data': return 'Paket Data';
      case 'electricity': return 'PLN';
      case 'water': return 'PDAM';
      case 'bpjs': return 'BPJS';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Produk PPOB</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
              className="whitespace-nowrap"
            >
              Semua
            </Button>
            {categories?.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Balance Card - only show if user is logged in */}
      {user && (
        <div className="p-4">
          <UserBalanceCard />
        </div>
      )}

      {/* Products Grid */}
      <div className="p-4">
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={handleBuyProduct}
              />
            ))}
          </div>
        )}

        {!productsLoading && filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionModal
        product={selectedProduct}
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />

      <BottomNavigation />
    </div>
  );
}
