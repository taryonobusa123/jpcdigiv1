
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUpdateProductPrice, useBatchUpdatePrices } from '@/hooks/useProductPricing';
import ProductPricingHeader from './pricing/ProductPricingHeader';
import BatchUpdateControls from './pricing/BatchUpdateControls';
import ProductPricingTable from './pricing/ProductPricingTable';

interface Product {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  brand: string;
  seller_price: number;
  buyer_price: number;
  is_active: boolean;
}

interface ProductPricingManagerProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductPricingManager({ products, isLoading }: ProductPricingManagerProps) {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [marginPercentage, setMarginPercentage] = useState<number>(10);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

  const updateProductPrice = useUpdateProductPrice();
  const batchUpdatePrices = useBatchUpdatePrices();

  // Update display products when props change
  useEffect(() => {
    setDisplayProducts(products || []);
  }, [products]);

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
        
        // Update local state immediately for better UX
        setDisplayProducts(prev => 
          prev.map(product => 
            product.id === editingProduct 
              ? { ...product, buyer_price: editPrice }
              : product
          )
        );
        
        setEditingProduct(null);
        setEditPrice(0);
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
    if (checked) {
      setSelectedProducts(new Set(displayProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleBatchMarginUpdate = async () => {
    if (selectedProducts.size === 0) return;

    const updates = Array.from(selectedProducts).map(productId => {
      const product = displayProducts.find(p => p.id === productId);
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
      
      // Update local state immediately for better UX
      setDisplayProducts(prev => 
        prev.map(product => {
          const update = updates.find(u => u.id === product.id);
          return update ? { ...product, buyer_price: update.buyer_price } : product;
        })
      );
      
      setSelectedProducts(new Set());
    } catch (error) {
      console.error('Failed to batch update prices:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <ProductPricingHeader />
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <ProductPricingHeader />
      <CardContent>
        <BatchUpdateControls
          marginPercentage={marginPercentage}
          setMarginPercentage={setMarginPercentage}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          onBatchUpdate={handleBatchMarginUpdate}
          isUpdating={batchUpdatePrices.isPending}
        />

        <ProductPricingTable
          products={displayProducts}
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

        {displayProducts && displayProducts.length > 100 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Menampilkan 100 produk pertama dari {displayProducts.length} total produk
          </div>
        )}
      </CardContent>
    </Card>
  );
}
