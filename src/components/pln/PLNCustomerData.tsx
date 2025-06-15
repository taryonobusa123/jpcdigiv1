
import React from 'react';

interface CustomerData {
  customer_name: string;
  segment_power: string;
}

interface PLNCustomerDataProps {
  meterData: CustomerData;
}

const PLNCustomerData = ({ meterData }: PLNCustomerDataProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Pelanggan</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Nama</span>
          <span className="font-medium">{meterData.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tarif/Daya</span>
          <span className="font-medium">{meterData.segment_power}</span>
        </div>
      </div>
    </div>
  );
};

export default PLNCustomerData;
