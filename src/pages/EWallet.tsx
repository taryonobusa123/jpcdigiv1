
import React, { useState } from 'react';
import { ArrowLeft, Wallet, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const EWallet = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const ewallets = [
    {
      name: 'GoPay',
      logo: '🟢',
      color: 'bg-green-500',
      description: 'Top up saldo GoPay untuk berbagai kebutuhan'
    },
    {
      name: 'OVO',
      logo: '🟣',
      color: 'bg-purple-500',
      description: 'Isi saldo OVO untuk transaksi harian'
    },
    {
      name: 'DANA',
      logo: '🔵',
      color: 'bg-blue-500',
      description: 'Top up DANA untuk pembayaran digital'
    },
    {
      name: 'LinkAja',
      logo: '🔴',
      color: 'bg-red-500',
      description: 'Isi saldo LinkAja dengan mudah'
    },
    {
      name: 'ShopeePay',
      logo: '🟠',
      color: 'bg-orange-500',
      description: 'Top up ShopeePay untuk berbelanja'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Top Up E-Wallet</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari e-wallet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* E-Wallets */}
      <div className="p-4 space-y-4">
        {ewallets.map((ewallet, index) => (
          <Link
            key={index}
            to={`/ewallet/${ewallet.name.toLowerCase()}`}
            className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 hover:bg-indigo-50 transition-colors active:scale-95"
          >
            <div className={`p-3 rounded-lg ${ewallet.color}`}>
              <Wallet className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-lg">{ewallet.name}</h4>
              <p className="text-gray-500 text-sm">{ewallet.description}</p>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}

        {/* Popular Amounts */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Nominal Populer</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Rp 50.000', 'Rp 100.000', 'Rp 200.000', 'Rp 500.000'].map((amount, index) => (
              <button
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">{amount}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default EWallet;
