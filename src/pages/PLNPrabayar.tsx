
import React, { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const PLNPrabayar = () => {
  const [meterNumber, setMeterNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');

  const amounts = [
    'Rp 20.000', 'Rp 50.000', 'Rp 100.000', 'Rp 200.000',
    'Rp 500.000', 'Rp 1.000.000'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">PLN Prabayar (Token)</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Beli Token Listrik</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Meter / ID Pelanggan
              </label>
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="Masukkan nomor meter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Nominal</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {amounts.map((amount, index) => (
              <button
                key={index}
                onClick={() => setSelectedAmount(amount)}
                className={`p-4 rounded-lg border-2 text-center font-semibold transition-colors ${
                  selectedAmount === amount
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {selectedAmount && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Token Listrik</span>
                <span className="font-medium">{selectedAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">Rp 2.500</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Bayar</span>
                <span className="text-yellow-600">
                  Rp {(parseInt(selectedAmount.replace(/\D/g, '')) + 2500).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            
            <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mt-4">
              Beli Token
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PLNPrabayar;
