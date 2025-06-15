
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateProductPrice, useBatchUpdatePrices } from '@/hooks/useProductPricing';
import { Edit, Save, X, DollarSign, TrendingUp } from 'lucide-react';

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
    return ((buyerPrice - sellerPrice) / sellerPrice * 100).toFixed(1);
  };

  const handleEditStart = (product: Product) => {
    setEditingProduct(product.id);
    setEditPrice(product.buyer_price);
  };

  const handleEditSave = async () => {
    if (editingProduct && editPrice > 0) {
      await updateProductPrice.mutateAsync({
        productId: editingProduct,
        newBuyerPrice: editPrice,
      });
      setEditingProduct(null);
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

  const handleBatchMarginUpdate = async () => {
    if (selectedProducts.size === 0) return;

    const updates = Array.from(selectedProducts).map(productId => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;

      const newBuyerPrice = product.seller_price * (1 + marginPercentage / 100);
      return {
        id: productId,
        buyer_price: Math.round(newBuyerPrice),
      };
    }).filter(Boolean) as Array<{ id: string; buyer_price: number }>;

    await batchUpdatePrices.mutateAsync({ updates });
    setSelectedProducts(new Set());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Harga Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Pengaturan Harga Produk</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Batch Update Controls */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Update Margin Massal
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Margin (%):</label>
              <Input
                type="number"
                value={marginPercentage}
                onChange={(e) => setMarginPercentage(Number(e.target.value))}
                className="w-20"
                min="0"
                step="0.1"
              />
            </div>
            <Button
              onClick={handleBatchMarginUpdate}
              disabled={selectedProducts.size === 0 || batchUpdatePrices.isPending}
              variant="outline"
            >
              Update {selectedProducts.size} Produk Terpilih
            </Button>
            {selectedProducts.size > 0 && (
              <Button
                onClick={() => setSelectedProducts(new Set())}
                variant="ghost"
                size="sm"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(new Set(products.map(p => p.id)));
                      } else {
                        setSelectedProducts(new Set());
                      }
                    }}
                    checked={selectedProducts.size === products.length && products.length > 0}
                  />
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Harga Modal</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.slice(0, 100).map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleProductSelect(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell className="max-w-xs truncate">{product.product_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{formatCurrency(product.seller_price)}</TableCell>
                  <TableCell>
                    {editingProduct === product.id ? (
                      <Input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-32"
                        min={product.seller_price}
                      />
                    ) : (
                      formatCurrency(product.buyer_price)
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      Number(calculateMargin(product.seller_price, product.buyer_price)) > 0 
                        ? 'default' 
                        : 'destructive'
                    }>
                      {calculateMargin(product.seller_price, product.buyer_price)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingProduct === product.id ? (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          onClick={handleEditSave}
                          disabled={updateProductPrice.isPending}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {products && products.length > 100 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Menampilkan 100 produk pertama dari {products.length} total produk
          </div>
        )}
      </CardContent>
    </Card>
  );
}
