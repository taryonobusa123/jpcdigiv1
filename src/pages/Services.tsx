
import React, { useState } from 'react';
import { 
  Bell, CreditCard, Upload, Download, Settings, HelpCircle,
  Search, Zap, Wifi, Smartphone, Gamepad2, CreditCard as CardIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const serviceCategories = [
    {
      title: 'Tagihan Listrik & Utilitas',
      icon: Zap,
      color: 'bg-yellow-500',
      services: [
        { name: 'PLN Pascabayar', description: 'Bayar tagihan listrik bulanan', popular: true, path: '/payment/electricity/pln-pascabayar' },
        { name: 'PLN Prabayar/Token', description: 'Beli token listrik prabayar', path: '/payment/electricity/pln-prabayar-(token)' },
        { name: 'PDAM', description: 'Bayar tagihan air', path: '/payment/water/pdam-jakarta' },
        { name: 'Gas Negara (PGN)', description: 'Bayar tagihan gas', path: '/payment/gas/pgn' },
        { name: 'Telepon Rumah', description: 'Bayar tagihan telepon Telkom', path: '/payment/telephone/telkom' }
      ]
    },
    {
      title: 'Internet & TV Kabel',
      icon: Wifi,
      color: 'bg-purple-500',
      services: [
        { name: 'IndiHome', description: 'Bayar tagihan internet Telkom', popular: true, path: '/service/indihome' },
        { name: 'First Media', description: 'Bayar layanan internet & TV', path: '/service/first-media' },
        { name: 'MNC Vision', description: 'Bayar TV kabel MNC', path: '/service/mnc-vision' },
        { name: 'Transvision', description: 'Bayar TV satelit', path: '/service/transvision' },
        { name: 'Biznet', description: 'Bayar internet Biznet', path: '/service/biznet' }
      ]
    },
    {
      title: 'Pulsa & Paket Data',
      icon: Smartphone,
      color: 'bg-green-500',
      services: [
        { name: 'Telkomsel', description: 'Pulsa & paket data Telkomsel', popular: true, path: '/topup/telkomsel/pulsa' },
        { name: 'Indosat Ooredoo', description: 'Pulsa & paket data Indosat', path: '/topup/indosat/pulsa' },
        { name: 'XL Axiata', description: 'Pulsa & paket data XL', path: '/topup/xl/pulsa' },
        { name: 'Tri (3)', description: 'Pulsa & paket data Tri', path: '/topup/tri/pulsa' },
        { name: 'Smartfren', description: 'Pulsa & paket data Smartfren', path: '/topup/smartfren/pulsa' }
      ]
    },
    {
      title: 'E-Wallet & Top Up',
      icon: CardIcon,
      color: 'bg-blue-500',
      services: [
        { name: 'GoPay', description: 'Top up saldo GoPay', popular: true, path: '/ewallet/gopay' },
        { name: 'OVO', description: 'Top up saldo OVO', path: '/ewallet/ovo' },
        { name: 'DANA', description: 'Top up saldo DANA', path: '/ewallet/dana' },
        { name: 'LinkAja', description: 'Top up saldo LinkAja', path: '/ewallet/linkaja' },
        { name: 'ShopeePay', description: 'Top up saldo ShopeePay', path: '/ewallet/shopeepay' }
      ]
    },
    {
      title: 'BPJS & Asuransi',
      icon: Settings,
      color: 'bg-red-500',
      services: [
        { name: 'BPJS Kesehatan', description: 'Bayar iuran BPJS Kesehatan', popular: true, path: '/insurance/bpjs-kesehatan' },
        { name: 'BPJS Ketenagakerjaan', description: 'Bayar iuran BPJS TK', path: '/insurance/bpjs-ketenagakerjaan' },
        { name: 'Asuransi Prudential', description: 'Bayar premi asuransi', path: '/insurance/prudential' },
        { name: 'Asuransi AXA', description: 'Bayar premi AXA', path: '/insurance/axa' }
      ]
    },
    {
      title: 'Gaming & Entertainment',
      icon: Gamepad2,
      color: 'bg-indigo-500',
      services: [
        { name: 'Mobile Legends', description: 'Diamond ML & battle pass', popular: true, path: '/gaming/mobile-legends' },
        { name: 'Free Fire', description: 'Diamond FF & membership', path: '/gaming/free-fire' },
        { name: 'PUBG Mobile', description: 'UC PUBG & Royal Pass', path: '/gaming/pubg-mobile' },
        { name: 'Steam Wallet', description: 'Top up Steam Wallet', path: '/gaming/steam-wallet' },
        { name: 'Google Play', description: 'Voucher Google Play', path: '/gaming/google-play' }
      ]
    }
  ];

  const filteredCategories = serviceCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.services.some(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sticky top-0 z-40">
        <h1 className="text-xl font-bold mb-4">Semua Layanan</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Services */}
      <div className="p-4 space-y-4">
        {filteredCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2.5 rounded-lg ${category.color}`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800">{category.title}</h3>
                <p className="text-gray-500 text-xs">{category.services.length} layanan tersedia</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {category.services.map((service, serviceIndex) => (
                <Link
                  key={serviceIndex}
                  to={service.path}
                  className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-95 block"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm hover:text-blue-600">
                        {service.name}
                      </h4>
                      <p className="text-gray-500 text-xs">{service.description}</p>
                    </div>
                    {service.popular && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        Populer
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Services;
