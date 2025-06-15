
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function ProductPricingHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <DollarSign className="w-5 h-5" />
        <span>Pengaturan Harga Produk</span>
      </CardTitle>
    </CardHeader>
  );
}
