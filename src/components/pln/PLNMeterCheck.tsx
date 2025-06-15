
import React from 'react';
import { Input } from '@/components/ui/input';

interface PLNMeterCheckProps {
  customerNumber: string;
  setCustomerNumber: (value: string) => void;
  onCheckMeter: () => void;
  isCheckingMeter: boolean;
}

const PLNMeterCheck = ({ 
  customerNumber, 
  setCustomerNumber, 
  onCheckMeter, 
  isCheckingMeter 
}: PLNMeterCheckProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Meter/ID Pelanggan</h3>
      
      <div className="space-y-4">
        <Input
          type="text"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
          placeholder="Masukkan nomor meter atau ID pelanggan"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        
        {customerNumber.trim() && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            ✓ Produk PLN tersedia untuk nomor meter: {customerNumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default PLNMeterCheck;
