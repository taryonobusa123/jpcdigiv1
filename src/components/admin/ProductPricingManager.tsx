
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUpdateProductPrice, useBatchUpdatePrices } from '@/hooks/useProductPricing';
import { useAllProducts } from '@/hooks/useProducts';
import ProductPricingHeader from './pricing/ProductPricingHeader';
import BatchUpdateControls from './pricing/BatchUpdateControls';
import ProductPricingTable from './pricing/ProductPricingTable';
import ProductForm from './pricing/ProductForm';

interface Product {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  brand: string;
  type: string;
  seller_price: number;
  buyer_price: number;
  buyer_sku_code?: string;
  description?: string;
  start_cut_off?: string;
  end_cut_off?: string;
  is_active: boolean;
}

export default function ProductPricingManager() {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [marginPercentage, setMarginPercentage] = useState<number>(10);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Use real Supabase data
  const { data: products, isLoading, refetch } = useAllProducts();
  const updateProductPrice = useUpdateProductPrice();
  const batchUpdatePrices = useBatchUpdatePrices();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMargin = (sellerPrice: number, buyerPrice: number) => {
    if (sellerPrice <= 0) return '0';
    return ((buyerPrice - sellerPrice) / sellerPrice * 100).toFixed(1);
  };

  const handleEditStart = (product: Product) => {
    setEditingProduct(product.id);
    setEditPrice(product.buyer_price);
  };

  const handleEditSave = async () => {
    if (editingProduct && editPrice > 0) {
      try {
        await updateProductPrice.mutateAsync({
          productId: editingProduct,
          newBuyerPrice: editPrice,
        });
        
        setEditingProduct(null);
        setEditPrice(0);
        
        // Force refresh after successful update
        setTimeout(() => {
          refetch();
        }, 200);
      } catch (error) {
        console.error('Failed to update price:', error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditPrice(0);
  };

  const handleProductSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && products) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleBatchMarginUpdate = async () => {
    if (selectedProducts.size === 0 || !products) return;

    const updates = Array.from(selectedProducts).map(productId => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;

      const newBuyerPrice = product.seller_price * (1 + marginPercentage / 100);
      return {
        id: productId,
        buyer_price: Math.round(newBuyerPrice),
      };
    }).filter(Boolean) as Array<{ id: string; buyer_price: number }>;

    console.log('Preparing batch update:', updates);

    try {
      await batchUpdatePrices.mutateAsync({ updates });
      
      setSelectedProducts(new Set());
      
      // Force refresh after successful batch update
      setTimeout(() => {
        refetch();
      }, 300);
    } catch (error) {
      console.error('Failed to batch update prices:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <ProductPricingHeader />
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data produk...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <ProductPricingHeader />
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <ProductForm onSuccess={handleRefresh} />
          </div>
          <div className="text-sm text-gray-600">
            Total: {products?.length || 0} produk
          </div>
        </div>

        <BatchUpdateControls
          marginPercentage={marginPercentage}
          setMarginPercentage={setMarginPercentage}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          onBatchUpdate={handleBatchMarginUpdate}
          isUpdating={batchUpdatePrices.isPending}
        />

        <ProductPricingTable
          products={products || []}
          selectedProducts={selectedProducts}
          onProductSelect={handleProductSelect}
          onSelectAll={handleSelectAll}
          editingProduct={editingProduct}
          editPrice={editPrice}
          setEditPrice={setEditPrice}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
          isUpdating={updateProductPrice.isPending}
          formatCurrency={formatCurrency}
          calculateMargin={calculateMargin}
        />

        {products && products.length > 100 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Menampilkan 100 produk pertama dari {products.length} total produk
          </div>
        )}
      </CardContent>
    </Card>
  );
}
