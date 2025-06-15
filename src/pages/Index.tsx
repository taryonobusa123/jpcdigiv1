
import React from 'react';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import PromoSection from '../components/PromoSection';
import ServiceCategory from '../components/ServiceCategory';
import BottomNavigation from '../components/BottomNavigation';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { 
  Bell, 
  CreditCard, 
  Upload, 
  Download, 
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const Index = () => {
  const { user, profile } = useAuth();
  const { data: transactions = [] } = useTransactions();

  const serviceCategories = [
    {
      title: 'Tagihan Listrik & Utilitas',
      icon: Bell,
      color: 'bg-yellow-500',
      services: [
        { name: 'PLN Pascabayar', description: 'Bayar tagihan listrik bulanan', popular: true },
        { name: 'PLN Prabayar/Token', description: 'Beli token listrik prabayar' },
        { name: 'PDAM', description: 'Bayar tagihan air' },
        { name: 'Gas Negara (PGN)', description: 'Bayar tagihan gas' },
        { name: 'Telepon Rumah', description: 'Bayar tagihan telepon Telkom' }
      ]
    },
    {
      title: 'Internet & TV Kabel',
      icon: Upload,
      color: 'bg-purple-500',
      services: [
        { name: 'IndiHome', description: 'Bayar tagihan internet Telkom', popular: true },
        { name: 'First Media', description: 'Bayar layanan internet & TV' },
        { name: 'MNC Vision', description: 'Bayar TV kabel MNC' },
        { name: 'Transvision', description: 'Bayar TV satelit' },
        { name: 'Biznet', description: 'Bayar internet Biznet' }
      ]
    },
    {
      title: 'Pulsa & Paket Data',
      icon: CreditCard,
      color: 'bg-green-500',
      services: [
        { name: 'Telkomsel', description: 'Pulsa & paket data Telkomsel', popular: true },
        { name: 'Indosat Ooredoo', description: 'Pulsa & paket data Indosat' },
        { name: 'XL Axiata', description: 'Pulsa & paket data XL' },
        { name: 'Tri (3)', description: 'Pulsa & paket data Tri' },
        { name: 'Smartfren', description: 'Pulsa & paket data Smartfren' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return <Clock className="w-3 h-3 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Berhasil';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Gagal';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  // Get recent transactions (last 3)
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="pb-6">
        <BalanceCard />
        <QuickActions />
        <PromoSection />
        
        <div className="mb-6">
          <div className="px-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Layanan Populer</h2>
          </div>
          <div className="space-y-0">
            {serviceCategories.map((category, index) => (
              <ServiceCategory
                key={index}
                title={category.title}
                icon={category.icon}
                color={category.color}
                services={category.services}
              />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white mx-4 rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Transaksi Terakhir</h3>
            {user && (
              <button 
                onClick={() => window.location.href = '/history'}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Lihat Semua
              </button>
            )}
          </div>
          
          {!user ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm mb-3">Login untuk melihat transaksi Anda</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Login Sekarang
              </button>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">Belum ada transaksi</p>
              <p className="text-gray-400 text-xs mt-1">Mulai bertransaksi untuk melihat riwayat di sini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{transaction.type}</h4>
                    <p className="text-gray-500 text-xs">{transaction.date} • {transaction.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm">{transaction.amount}</p>
                    <div className={`flex items-center justify-end space-x-1 ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="text-xs font-medium">{getStatusText(transaction.status)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Index;
