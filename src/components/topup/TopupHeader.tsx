
import React from 'react';
import { ArrowLeft, Wallet, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface TopupHeaderProps {
  balance: number;
}

const TopupHeader = ({ balance }: TopupHeaderProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Top Up Saldo</h1>
        </div>
        <Link to="/topup-history" className="p-2 hover:bg-white/20 rounded-lg">
          <History className="w-5 h-5" />
        </Link>
      </div>
      
      {/* Current Balance */}
      <Card className="bg-white/10 backdrop-blur-sm border-0">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Wallet className="w-6 h-6" />
            <div>
              <p className="text-blue-100 text-sm">Saldo Saat Ini</p>
              <p className="text-xl font-bold">{formatCurrency(balance)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopupHeader;
