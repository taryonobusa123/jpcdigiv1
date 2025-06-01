
import React, { useState } from 'react';
import { ArrowLeft, Building2, Wallet, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const Transfer = () => {
  const transferOptions = [
    {
      title: 'Transfer ke Bank',
      description: 'Transfer ke semua bank di Indonesia',
      icon: Building2,
      color: 'bg-blue-500',
      path: '/transfer/bank'
    },
    {
      title: 'Transfer ke E-Wallet',
      description: 'Transfer ke GoPay, OVO, DANA, dll',
      icon: Wallet,
      color: 'bg-purple-500',
      path: '/transfer/ewallet'
    },
    {
      title: 'Transfer ke Sesama',
      description: 'Transfer ke pengguna aplikasi lain',
      icon: Users,
      color: 'bg-green-500',
      path: '/transfer/internal'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Transfer Dana</h1>
        </div>
      </div>

      {/* Balance Info */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="text-gray-600 text-sm mb-2">Saldo Tersedia</h3>
          <p className="text-2xl font-bold text-gray-800">Rp 2.500.000</p>
        </div>

        {/* Transfer Options */}
        <div className="space-y-4">
          {transferOptions.map((option, index) => (
            <Link
              key={index}
              to={option.path}
              className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div className={`p-3 rounded-lg ${option.color}`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{option.title}</h4>
                <p className="text-gray-500 text-sm">{option.description}</p>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Recent Transfers */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Transfer Terakhir</h3>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="space-y-3">
              {[
                { name: 'Ahmad Rizki', bank: 'BCA', amount: 'Rp 500.000', time: '2 jam lalu' },
                { name: 'Sari Dewi', bank: 'Mandiri', amount: 'Rp 250.000', time: '1 hari lalu' }
              ].map((transfer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{transfer.name}</h4>
                    <p className="text-gray-500 text-sm">{transfer.bank} • {transfer.time}</p>
                  </div>
                  <span className="font-semibold text-gray-800">{transfer.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Transfer;
