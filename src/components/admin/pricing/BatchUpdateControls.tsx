
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp } from 'lucide-react';

interface BatchUpdateControlsProps {
  marginPercentage: number;
  setMarginPercentage: (value: number) => void;
  selectedProducts: Set<string>;
  setSelectedProducts: (products: Set<string>) => void;
  onBatchUpdate: () => void;
  isUpdating: boolean;
}

export default function BatchUpdateControls({
  marginPercentage,
  setMarginPercentage,
  selectedProducts,
  setSelectedProducts,
  onBatchUpdate,
  isUpdating
}: BatchUpdateControlsProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Update Margin Massal
      </h3>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Margin (%):</label>
          <Input
            type="number"
            value={marginPercentage}
            onChange={(e) => setMarginPercentage(Number(e.target.value))}
            className="w-20"
            min="0"
            step="0.1"
          />
        </div>
        <Button
          onClick={onBatchUpdate}
          disabled={selectedProducts.size === 0 || isUpdating}
          variant="outline"
        >
          {isUpdating ? 'Updating...' : `Update ${selectedProducts.size} Produk Terpilih`}
        </Button>
        {selectedProducts.size > 0 && (
          <Button
            onClick={() => setSelectedProducts(new Set())}
            variant="ghost"
            size="sm"
          >
            Clear Selection
          </Button>
        )}
      </div>
    </div>
  );
}
