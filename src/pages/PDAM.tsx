
import React, { useState } from 'react';
import { ArrowLeft, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const PDAM = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const regions = [
    'PDAM Jakarta', 'PDAM Surabaya', 'PDAM Bandung', 
    'PDAM Semarang', 'PDAM Medan', 'PDAM Makassar'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">PDAM</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Wilayah</h3>
          
          <div className="space-y-2">
            {regions.map((region, index) => (
              <button
                key={index}
                onClick={() => setSelectedRegion(region)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedRegion === region
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {selectedRegion && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Pelanggan</h3>
            
            <input
              type="text"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Masukkan nomor pelanggan"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Cek Tagihan
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PDAM;
