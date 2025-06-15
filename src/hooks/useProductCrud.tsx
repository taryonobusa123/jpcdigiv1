
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateProductData {
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
  is_active?: boolean;
}

interface UpdateProductData {
  id: string;
  sku?: string;
  product_name?: string;
  category?: string;
  brand?: string;
  type?: string;
  seller_price?: number;
  buyer_price?: number;
  buyer_sku_code?: string;
  description?: string;
  start_cut_off?: string;
  end_cut_off?: string;
  is_active?: boolean;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productData: CreateProductData) => {
      console.log('Creating new product:', productData);

      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select();

      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }

      console.log('Product created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Berhasil",
        description: "Produk berhasil ditambahkan",
      });
    },
    onError: (error) => {
      console.error('Product creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan produk",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productData: UpdateProductData) => {
      console.log('Updating product:', productData);

      const { id, ...updateData } = productData;
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }

      console.log('Product updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Berhasil",
        description: "Produk berhasil diupdate",
      });
    },
    onError: (error) => {
      console.error('Product update error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengupdate produk",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      console.log('Deleting product:', productId);

      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .select();

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      console.log('Product deleted successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Berhasil",
        description: "Produk berhasil dihapus",
      });
    },
    onError: (error) => {
      console.error('Product deletion error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus produk",
        variant: "destructive",
      });
    },
  });
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, isActive }: { productId: string; isActive: boolean }) => {
      console.log('Toggling product status:', productId, isActive);

      const { data, error } = await supabase
        .from('products')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select();

      if (error) {
        console.error('Error toggling product status:', error);
        throw error;
      }

      console.log('Product status toggled successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Berhasil",
        description: "Status produk berhasil diupdate",
      });
    },
    onError: (error) => {
      console.error('Product status toggle error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengupdate status produk",
        variant: "destructive",
      });
    },
  });
}
