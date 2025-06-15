
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlnProduct {
  id: string;
  product_name: string;
  buyer_price: number;
  buyer_sku_code: string;
  description: string;
}

interface PLNProductListProps {
  products: PlnProduct[];
  meterNumber: string;
  onPurchase: (product: PlnProduct) => void;
  isLoading?: boolean;
}

const PLNProductList = ({ products, meterNumber, onPurchase, isLoading }: PLNProductListProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!meterNumber) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Nominal Token PLN</CardTitle>
        <p className="text-sm text-gray-600">
          Nomor Meter: <span className="font-semibold">{meterNumber}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{product.product_name}</h4>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-yellow-600 mb-2">
                  {formatPrice(product.buyer_price)}
                </div>
                <Button
                  onClick={() => onPurchase(product)}
                  disabled={isLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  {isLoading ? 'Processing...' : 'Beli'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PLNProductList;
