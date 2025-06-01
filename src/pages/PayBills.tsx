
import React, { useState } from 'react';
import { ArrowLeft, Zap, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const PayBills = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const billCategories = [
    {
      id: 'electricity',
      title: 'Listrik',
      icon: Zap,
      color: 'bg-yellow-500',
      services: [
        { name: 'PLN Pascabayar', desc: 'Bayar tagihan listrik bulanan' },
        { name: 'PLN Prabayar (Token)', desc: 'Beli token listrik' }
      ]
    },
    {
      id: 'water',
      title: 'Air (PDAM)',
      icon: Zap,
      color: 'bg-blue-500',
      services: [
        { name: 'PDAM Jakarta', desc: 'Bayar tagihan air Jakarta' },
        { name: 'PDAM Surabaya', desc: 'Bayar tagihan air Surabaya' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Bayar Tagihan</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari layanan tagihan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 space-y-4">
        {billCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2.5 rounded-lg ${category.color}`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
            </div>
            
            <div className="space-y-2">
              {category.services.map((service, index) => (
                <Link
                  key={index}
                  to={`/payment/${category.id}/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">{service.name}</h4>
                    <p className="text-gray-500 text-sm">{service.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
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

export default PayBills;
