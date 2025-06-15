
import React, { useState } from 'react';
import { Eye, EyeOff, Plus, ArrowUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const { user, profile } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const userBalance = profile?.balance || 0;
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg mx-4 -mt-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-green-100 text-xs mb-2">
            {user ? `Saldo ${userName}` : 'Saldo Dompet Digital'}
          </p>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold">
              {user ? 
                (showBalance ? formatCurrency(userBalance) : 'Rp ••••••••') :
                'Rp ••••••••'
              }
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-green-600 rounded transition-colors"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-green-100 text-xs">Poin Reward</p>
          <p className="text-lg font-semibold">{user ? '1,250' : '0'}</p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        {user ? (
          <>
            <Link 
              to="/topup-saldo"
              className="flex-1 bg-white text-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Top Up</span>
            </Link>
            <Link
              to="/transfer"
              className="flex-1 bg-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Transfer</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex-1 bg-white text-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <span>Login</span>
            </Link>
            <Link
              to="/login"
              className="flex-1 bg-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <span>Daftar</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;
