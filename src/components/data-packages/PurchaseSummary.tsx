
import React from 'react';
import { Button } from '@/components/ui/button';

interface Package {
  id: string;
  brand: string;
  product_name: string;
  buyer_price: number;
}

interface PurchaseSummaryProps {
  selectedProduct: Package;
  phoneNumber: string;
  onPurchase: () => void;
  isPending: boolean;
}

const PurchaseSummary = ({ selectedProduct, phoneNumber, onPurchase, isPending }: PurchaseSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Ringkasan Pembelian</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nomor</span>
            <span>{phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Paket</span>
            <span>{selectedProduct.product_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider</span>
            <span>{selectedProduct.brand}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-purple-600">{formatPrice(selectedProduct.buyer_price)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onPurchase}
        disabled={isPending}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isPending ? 'Memproses...' : 'Beli Sekarang'}
      </Button>
    </div>
  );
};

export default PurchaseSummary;
