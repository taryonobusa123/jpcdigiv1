
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  brand: string;
  buyer_price: number;
  description: string;
}

interface TransactionModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionModal({ product, open, onOpenChange }: TransactionModalProps) {
  const [customerId, setCustomerId] = useState('');
  const { profile } = useAuth();
  const createTransaction = useCreateTransaction();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCustomerIdLabel = (category: string) => {
    switch (category) {
      case 'pulsa':
      case 'data':
        return 'Nomor HP';
      case 'electricity':
        return 'Nomor Meter / ID Pelanggan';
      case 'water':
        return 'ID Pelanggan PDAM';
      default:
        return 'Nomor / ID Pelanggan';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !customerId.trim()) return;

    // Check if user has sufficient balance
    if (!profile || profile.balance < product.buyer_price) {
      alert('Saldo tidak mencukupi. Silakan top up terlebih dahulu.');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        customer_id: customerId,
        sku: product.sku,
        product_name: product.product_name,
        price: product.buyer_price,
      });
      onOpenChange(false);
      setCustomerId('');
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembelian</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm">{product.product_name}</h3>
            <p className="text-xs text-gray-600 mt-1">{product.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Harga:</span>
              <span className="font-bold text-blue-600">{formatPrice(product.buyer_price)}</span>
            </div>
          </div>

          {/* Balance Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Saldo Anda:</span>
              <span className="font-medium">{formatPrice(profile?.balance || 0)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">Sisa Saldo:</span>
              <span className={`font-medium ${
                (profile?.balance || 0) - product.buyer_price >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPrice((profile?.balance || 0) - product.buyer_price)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">{getCustomerIdLabel(product.category)}</Label>
              <Input
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder={`Masukkan ${getCustomerIdLabel(product.category).toLowerCase()}`}
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createTransaction.isPending || (profile?.balance || 0) < product.buyer_price}
              >
                {createTransaction.isPending ? 'Memproses...' : 'Beli Sekarang'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
