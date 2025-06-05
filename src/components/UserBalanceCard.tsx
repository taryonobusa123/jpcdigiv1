
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function UserBalanceCard() {
  const { profile } = useAuth();

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(balance);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Wallet className="w-4 h-4" />
          <span>Saldo Anda</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">
              {formatBalance(profile?.balance || 0)}
            </p>
            <p className="text-blue-100 text-xs mt-1">
              {profile?.full_name || 'User'}
            </p>
          </div>
          <Link to="/topup">
            <Button variant="secondary" size="sm" className="text-blue-600">
              <Plus className="w-4 h-4 mr-1" />
              Top Up
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
