
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface PlnProduct {
  id: string;
  product_name: string;
  buyer_price: number;
  buyer_sku_code: string;
  description: string;
}

interface PLNPurchaseConfirmationProps {
  product: PlnProduct | null;
  meterNumber: string;
  meterData: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmPurchase: () => void;
  isLoading: boolean;
}

const PLNPurchaseConfirmation = ({ 
  product, 
  meterNumber, 
  meterData, 
  open, 
  onOpenChange, 
  onConfirmPurchase,
  isLoading 
}: PLNPurchaseConfirmationProps) => {
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!product) return null;

  const adminFee = 2500;
  const totalAmount = product.buyer_price + adminFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembelian Token PLN</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Info */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-lg text-gray-800">{product.product_name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Data Pelanggan</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nomor Meter:</span>
                <span className="font-medium">{meterNumber}</span>
              </div>
              {meterData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{meterData.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarif/Daya:</span>
                    <span className="font-medium">{meterData.segment_power}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-800 mb-3">Rincian Pembayaran</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Token PLN</span>
                <span className="font-medium">{formatPrice(product.buyer_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">{formatPrice(adminFee)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Bayar</span>
                <span className="text-yellow-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Balance Info */}
          {user && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Saldo Anda:</span>
                <span className="font-medium">{formatPrice(user.balance || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Sisa Saldo:</span>
                <span className={`font-medium ${
                  (user.balance || 0) - totalAmount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPrice((user.balance || 0) - totalAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              onClick={onConfirmPurchase}
              disabled={isLoading || !user || (user.balance || 0) < totalAmount}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isLoading ? 'Memproses...' : 'Konfirmasi Beli'}
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-red-600 text-center">
              Silakan login terlebih dahulu untuk melakukan pembelian
            </p>
          )}

          {user && (user.balance || 0) < totalAmount && (
            <p className="text-sm text-red-600 text-center">
              Saldo tidak mencukupi. Silakan top up terlebih dahulu.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PLNPurchaseConfirmation;
