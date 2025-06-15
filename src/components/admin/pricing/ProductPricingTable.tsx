
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProductRow from './ProductRow';

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

interface ProductPricingTableProps {
  products: Product[];
  selectedProducts: Set<string>;
  onProductSelect: (productId: string) => void;
  onSelectAll: (checked: boolean) => void;
  editingProduct: string | null;
  editPrice: number;
  setEditPrice: (price: number) => void;
  onEditStart: (product: Product) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  isUpdating: boolean;
  formatCurrency: (amount: number) => string;
  calculateMargin: (sellerPrice: number, buyerPrice: number) => string;
}

export default function ProductPricingTable({
  products,
  selectedProducts,
  onProductSelect,
  onSelectAll,
  editingProduct,
  editPrice,
  setEditPrice,
  onEditStart,
  onEditSave,
  onEditCancel,
  isUpdating,
  formatCurrency,
  calculateMargin
}: ProductPricingTableProps) {
  return (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
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
            <ProductRow
              key={product.id}
              product={product}
              isSelected={selectedProducts.has(product.id)}
              onSelect={onProductSelect}
              editingProduct={editingProduct}
              editPrice={editPrice}
              setEditPrice={setEditPrice}
              onEditStart={onEditStart}
              onEditSave={onEditSave}
              onEditCancel={onEditCancel}
              isUpdating={isUpdating}
              formatCurrency={formatCurrency}
              calculateMargin={calculateMargin}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
