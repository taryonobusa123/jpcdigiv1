
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { 
  Edit, 
  Save, 
  X, 
  Trash2, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteProduct, useToggleProductStatus } from '@/hooks/useProductCrud';
import ProductForm from './ProductForm';

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

interface ProductRowProps {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: string) => void;
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

export default function ProductRow({
  product,
  isSelected,
  onSelect,
  editingProduct,
  editPrice,
  setEditPrice,
  onEditStart,
  onEditSave,
  onEditCancel,
  isUpdating,
  formatCurrency,
  calculateMargin
}: ProductRowProps) {
  const deleteProduct = useDeleteProduct();
  const toggleProductStatus = useToggleProductStatus();

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleProductStatus.mutateAsync({
        productId: product.id,
        isActive: !product.is_active,
      });
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
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
        <div className="flex items-center">
          <Badge variant={product.is_active ? 'default' : 'secondary'}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleStatus}
            disabled={toggleProductStatus.isPending}
            className="ml-2"
          >
            {product.is_active ? (
              <ToggleRight className="w-4 h-4 text-green-600" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-gray-400" />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          {editingProduct === product.id ? (
            <>
              <Button
                size="sm"
                onClick={onEditSave}
                disabled={isUpdating}
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onEditCancel}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditStart(product)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <ProductForm product={product} />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus produk "{product.product_name}"? 
                      Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={deleteProduct.isPending}
                    >
                      {deleteProduct.isPending ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
