
import React, { useState } from 'react';
import { Eye, EyeOff, Plus, ArrowUp } from 'lucide-react';

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const balance = 2500000; // Example balance

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-green-100 text-sm mb-2">Saldo Dompet Digital</p>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">
              {showBalance ? formatCurrency(balance) : 'Rp ••••••••'}
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-green-600 rounded transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-green-100 text-sm">Poin Reward</p>
          <p className="text-xl font-semibold">1,250</p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="flex-1 bg-white text-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Top Up</span>
        </button>
        <button className="flex-1 bg-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
          <ArrowUp className="w-5 h-5" />
          <span>Transfer</span>
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
