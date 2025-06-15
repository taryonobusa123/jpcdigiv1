
import React from 'react';
import { ArrowLeft, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DataPackageHeaderProps {
  balance?: number;
}

const DataPackageHeader = ({ balance }: DataPackageHeaderProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4">
      <div className="flex items-center space-x-3 mb-4">
        <Link to="/topup" className="p-2 hover:bg-white/20 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center space-x-2">
          <Wifi className="w-6 h-6" />
          <h1 className="text-xl font-bold">Paket Data</h1>
        </div>
      </div>
      
      {balance !== undefined && (
        <div className="bg-white/10 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Saldo Anda</span>
            <span className="font-bold">{formatPrice(balance)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPackageHeader;
