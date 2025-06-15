
import React from 'react';
import { Button } from '@/components/ui/button';

interface CustomerData {
  customer_name: string;
  segment_power: string;
}

interface PLNPurchaseSummaryProps {
  selectedAmount: string;
  meterData: CustomerData;
  onPurchase: () => void;
  user: any;
}

const PLNPurchaseSummary = ({ selectedAmount, meterData, onPurchase, user }: PLNPurchaseSummaryProps) => {
  const adminFee = 2500;
  const totalAmount = parseInt(selectedAmount) + adminFee;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pembelian</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Token PLN</span>
          <span className="font-medium">Rp {parseInt(selectedAmount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Biaya Admin</span>
          <span className="font-medium">Rp {adminFee.toLocaleString()}</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>Total Bayar</span>
          <span className="text-yellow-600">
            Rp {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
      
      <Button
        onClick={onPurchase}
        disabled={!user}
        className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mt-4 disabled:bg-gray-300"
      >
        {!user ? 'Login untuk Membeli' : 'Beli Token'}
      </Button>
    </div>
  );
};

export default PLNPurchaseSummary;
