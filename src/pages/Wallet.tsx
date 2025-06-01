
import React, { useState } from 'react';
import { 
  Eye, EyeOff, Plus, ArrowUp, ArrowDown, CreditCard, 
  Gift, History, TrendingUp, Wallet as WalletIcon
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(false);
  const balance = 2500000;
  const points = 1250;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickActions = [
    { icon: Plus, label: 'Top Up', color: 'bg-green-500' },
    { icon: ArrowUp, label: 'Transfer', color: 'bg-blue-500' },
    { icon: ArrowDown, label: 'Tarik', color: 'bg-purple-500' },
    { icon: CreditCard, label: 'Bayar', color: 'bg-orange-500' },
  ];

  const recentTransactions = [
    { type: 'Top Up', amount: '+Rp 500.000', time: '10:30', status: 'success' },
    { type: 'PLN Token', amount: '-Rp 100.000', time: '09:15', status: 'success' },
    { type: 'Transfer ke Bank', amount: '-Rp 200.000', time: '08:45', status: 'success' },
    { type: 'Pulsa Telkomsel', amount: '-Rp 25.000', time: '07:30', status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Dompet Digital</h1>
        
        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-green-100 text-sm mb-2">Saldo Utama</p>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">
                  {showBalance ? formatCurrency(balance) : 'Rp ••••••••'}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">Poin Reward</p>
              <p className="text-lg font-semibold">{points.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all active:scale-95"
            >
              <div className={`p-2 rounded-lg ${action.color} mb-2`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="p-4 space-y-4">
        {/* Investment Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Investasi Mudah</h3>
              <p className="text-purple-100 text-sm">Mulai dari Rp 10.000</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm mt-2">
                Mulai Investasi
              </button>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        {/* Cashback Card */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Cashback Spesial</h3>
              <p className="text-orange-100 text-sm">Hingga 50% untuk transaksi pertama</p>
              <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm mt-2">
                Klaim Sekarang
              </button>
            </div>
            <Gift className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Transaksi Terakhir</h3>
            <button className="text-blue-600 text-sm font-medium">Lihat Semua</button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.amount.startsWith('+') ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <WalletIcon className={`w-4 h-4 ${
                      transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">{transaction.type}</h4>
                    <p className="text-gray-500 text-xs">{transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-800'
                  }`}>
                    {transaction.amount}
                  </p>
                  <span className="text-green-600 text-xs">Berhasil</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Wallet;
