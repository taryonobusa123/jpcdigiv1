
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AmountSelectorProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const AmountSelector = ({ amount, onAmountChange }: AmountSelectorProps) => {
  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pilih Nominal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Predefined amounts */}
        <div className="grid grid-cols-2 gap-3">
          {predefinedAmounts.map((preAmount) => (
            <button
              key={preAmount}
              type="button"
              onClick={() => onAmountChange(preAmount.toString())}
              className={`p-3 border rounded-lg text-center transition-colors ${
                amount === preAmount.toString()
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {formatCurrency(preAmount)}
            </button>
          ))}
        </div>
        
        {/* Custom amount */}
        <div className="space-y-2">
          <Label htmlFor="custom-amount">Atau masukkan nominal lain</Label>
          <Input
            id="custom-amount"
            type="number"
            placeholder="Minimal Rp 10.000"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            min="10000"
          />
          <p className="text-sm text-gray-500">Minimal top up Rp 10.000</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmountSelector;
