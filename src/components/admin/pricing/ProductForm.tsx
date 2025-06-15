
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProductCrud';

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

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    product_name: product?.product_name || '',
    category: product?.category || '',
    brand: product?.brand || '',
    type: product?.type || 'prepaid',
    seller_price: product?.seller_price || 0,
    buyer_price: product?.buyer_price || 0,
    buyer_sku_code: product?.buyer_sku_code || '',
    description: product?.description || '',
    start_cut_off: product?.start_cut_off || '',
    end_cut_off: product?.end_cut_off || '',
    is_active: product?.is_active ?? true,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          ...formData,
        });
      } else {
        await createProduct.mutateAsync(formData);
      }
      
      setOpen(false);
      onSuccess?.();
      
      // Reset form if creating new product
      if (!product) {
        setFormData({
          sku: '',
          product_name: '',
          category: '',
          brand: '',
          type: 'prepaid',
          seller_price: 0,
          buyer_price: 0,
          buyer_sku_code: '',
          description: '',
          start_cut_off: '',
          end_cut_off: '',
          is_active: true,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {product ? 'Edit Produk' : 'Tambah Produk'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="buyer_sku_code">Buyer SKU Code</Label>
              <Input
                id="buyer_sku_code"
                value={formData.buyer_sku_code}
                onChange={(e) => handleInputChange('buyer_sku_code', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="product_name">Nama Produk</Label>
            <Input
              id="product_name"
              value={formData.product_name}
              onChange={(e) => handleInputChange('product_name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Tipe</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prepaid">Prepaid</SelectItem>
                <SelectItem value="postpaid">Postpaid</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="pln">PLN</SelectItem>
                <SelectItem value="games">Games</SelectItem>
                <SelectItem value="emoney">E-Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seller_price">Harga Modal</Label>
              <Input
                id="seller_price"
                type="number"
                value={formData.seller_price}
                onChange={(e) => handleInputChange('seller_price', Number(e.target.value))}
                required
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="buyer_price">Harga Jual</Label>
              <Input
                id="buyer_price"
                type="number"
                value={formData.buyer_price}
                onChange={(e) => handleInputChange('buyer_price', Number(e.target.value))}
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_cut_off">Start Cut Off</Label>
              <Input
                id="start_cut_off"
                type="time"
                value={formData.start_cut_off}
                onChange={(e) => handleInputChange('start_cut_off', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="end_cut_off">End Cut Off</Label>
              <Input
                id="end_cut_off"
                type="time"
                value={formData.end_cut_off}
                onChange={(e) => handleInputChange('end_cut_off', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Produk Aktif</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {createProduct.isPending || updateProduct.isPending 
                ? 'Menyimpan...' 
                : product ? 'Update' : 'Simpan'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
