
import React, { useState } from 'react';
import { ArrowLeft, Zap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const PLNPascabayar = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [billInfo, setBillInfo] = useState(null);

  const handleCheck = () => {
    // Simulate bill check
    setBillInfo({
      name: 'John Doe',
      address: 'Jl. Merdeka No. 123',
      period: 'Januari 2024',
      amount: 'Rp 350.000',
      adminFee: 'Rp 2.500'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">PLN Pascabayar</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pelanggan</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Pelanggan / ID Meter
              </label>
              <input
                type="text"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                placeholder="Masukkan nomor pelanggan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleCheck}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Cek Tagihan
            </button>
          </div>
        </div>

        {billInfo && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Tagihan</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama</span>
                <span className="font-medium">{billInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alamat</span>
                <span className="font-medium text-right">{billInfo.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Periode</span>
                <span className="font-medium">{billInfo.period}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-gray-600">Tagihan Listrik</span>
                <span className="font-medium">{billInfo.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">{billInfo.adminFee}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Bayar</span>
                <span className="text-yellow-600">Rp 352.500</span>
              </div>
            </div>
            
            <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mt-4">
              Bayar Sekarang
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PLNPascabayar;
