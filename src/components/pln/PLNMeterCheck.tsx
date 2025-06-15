
import React from 'react';
import { Button } from '@/components/ui/button';
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
        
        <Button
          onClick={onCheckMeter}
          disabled={!customerNumber.trim() || isCheckingMeter}
          className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-300"
        >
          {isCheckingMeter ? 'Mengecek...' : 'Cek Data Meter'}
        </Button>
      </div>
    </div>
  );
};

export default PLNMeterCheck;
