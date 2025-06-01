
import React from 'react';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import PromoSection from '../components/PromoSection';
import ServiceCategory from '../components/ServiceCategory';
import BottomNavigation from '../components/BottomNavigation';
import { 
  Bell, 
  CreditCard, 
  Upload, 
  Download, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const Index = () => {
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
          <h3 className="text-base font-semibold text-gray-800 mb-4">Transaksi Terakhir</h3>
          <div className="space-y-3">
            {[
              { type: 'PLN Token', amount: '-Rp 100.000', status: 'Berhasil', time: '2 jam lalu' },
              { type: 'Top Up GoPay', amount: '-Rp 200.000', status: 'Berhasil', time: '1 hari lalu' },
              { type: 'Pulsa Telkomsel', amount: '-Rp 25.000', status: 'Berhasil', time: '2 hari lalu' }
            ].map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{transaction.type}</h4>
                  <p className="text-gray-500 text-xs">{transaction.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 text-sm">{transaction.amount}</p>
                  <span className="text-green-600 text-xs">{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Index;
