
import React, { useState } from 'react';
import { ArrowLeft, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const IndiHome = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [billInfo, setBillInfo] = useState(null);

  const handleCheck = () => {
    setBillInfo({
      name: 'Jane Doe',
      package: 'IndiHome 2P 30 Mbps',
      period: 'Januari 2024',
      amount: 'Rp 315.000',
      adminFee: 'Rp 5.000'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/services" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">IndiHome</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Pelanggan</h3>
          
          <input
            type="text"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            placeholder="Masukkan nomor pelanggan IndiHome"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
          />
          
          <button
            onClick={handleCheck}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Cek Tagihan
          </button>
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
                <span className="text-gray-600">Paket</span>
                <span className="font-medium">{billInfo.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Periode</span>
                <span className="font-medium">{billInfo.period}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-gray-600">Tagihan IndiHome</span>
                <span className="font-medium">{billInfo.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">{billInfo.adminFee}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Bayar</span>
                <span className="text-red-600">Rp 320.000</span>
              </div>
            </div>
            
            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mt-4">
              Bayar Sekarang
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default IndiHome;
