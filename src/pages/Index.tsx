
import React from 'react';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import PromoSection from '../components/PromoSection';
import ServiceCategory from '../components/ServiceCategory';
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
    },
    {
      title: 'E-Wallet & Top Up',
      icon: Download,
      color: 'bg-blue-500',
      services: [
        { name: 'GoPay', description: 'Top up saldo GoPay', popular: true },
        { name: 'OVO', description: 'Top up saldo OVO' },
        { name: 'DANA', description: 'Top up saldo DANA' },
        { name: 'LinkAja', description: 'Top up saldo LinkAja' },
        { name: 'ShopeePay', description: 'Top up saldo ShopeePay' }
      ]
    },
    {
      title: 'BPJS & Asuransi',
      icon: Settings,
      color: 'bg-red-500',
      services: [
        { name: 'BPJS Kesehatan', description: 'Bayar iuran BPJS Kesehatan', popular: true },
        { name: 'BPJS Ketenagakerjaan', description: 'Bayar iuran BPJS TK' },
        { name: 'Asuransi Prudential', description: 'Bayar premi asuransi' },
        { name: 'Asuransi AXA', description: 'Bayar premi AXA' }
      ]
    },
    {
      title: 'Gaming & Entertainment',
      icon: HelpCircle,
      color: 'bg-indigo-500',
      services: [
        { name: 'Mobile Legends', description: 'Diamond ML & battle pass', popular: true },
        { name: 'Free Fire', description: 'Diamond FF & membership' },
        { name: 'PUBG Mobile', description: 'UC PUBG & Royal Pass' },
        { name: 'Steam Wallet', description: 'Top up Steam Wallet' },
        { name: 'Google Play', description: 'Voucher Google Play' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto p-6">
        <BalanceCard />
        <QuickActions />
        <PromoSection />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Semua Layanan PPOB</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaksi Terakhir</h3>
          <div className="space-y-3">
            {[
              { type: 'PLN Token', amount: '-Rp 100.000', status: 'Berhasil', time: '2 jam lalu' },
              { type: 'Top Up GoPay', amount: '-Rp 200.000', status: 'Berhasil', time: '1 hari lalu' },
              { type: 'Pulsa Telkomsel', amount: '-Rp 25.000', status: 'Berhasil', time: '2 hari lalu' }
            ].map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{transaction.type}</h4>
                  <p className="text-gray-500 text-sm">{transaction.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{transaction.amount}</p>
                  <span className="text-green-600 text-sm">{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-4">PPOB Indonesia</h4>
              <p className="text-gray-300 text-sm">
                Platform pembayaran online terpercaya untuk semua kebutuhan tagihan dan pembelian digital Anda.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Layanan</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Tagihan Listrik</li>
                <li>Pulsa & Data</li>
                <li>E-Wallet</li>
                <li>Gaming</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Bantuan</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>FAQ</li>
                <li>Live Chat</li>
                <li>Hubungi Kami</li>
                <li>Panduan</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Kontak</h5>
              <div className="text-sm text-gray-300 space-y-2">
                <p>📞 0804-1-500-000</p>
                <p>📧 support@ppobindonesia.com</p>
                <p>🕒 24/7 Customer Service</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
            © 2024 PPOB Indonesia. Semua hak dilindungi. Diawasi oleh Bank Indonesia & OJK.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
