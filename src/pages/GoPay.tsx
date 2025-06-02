
import React, { useState } from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const GoPay = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');

  const amounts = [
    'Rp 10.000', 'Rp 25.000', 'Rp 50.000', 'Rp 100.000',
    'Rp 200.000', 'Rp 500.000'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/ewallet" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Top Up GoPay</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Telepon GoPay</h3>
          
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
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
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
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
                <span className="text-gray-600">Top Up GoPay</span>
                <span className="font-medium">{selectedAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">Gratis</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Bayar</span>
                <span className="text-green-600">{selectedAmount}</span>
              </div>
            </div>
            
            <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-4">
              Top Up Sekarang
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GoPay;
