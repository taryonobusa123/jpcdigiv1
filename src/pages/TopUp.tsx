
import React, { useState } from 'react';
import { ArrowLeft, Smartphone, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const TopUp = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const operators = [
    {
      name: 'Pulsa All Operator',
      logo: '📱',
      color: 'bg-green-500',
      description: 'Beli pulsa semua operator',
      path: '/pulsa'
    },
    {
      name: 'Telkomsel',
      logo: '🔴',
      color: 'bg-red-500',
      services: ['Pulsa', 'Paket Data', 'Paket Telepon & SMS']
    },
    {
      name: 'Indosat Ooredoo',
      logo: '🟡',
      color: 'bg-yellow-500',
      services: ['Pulsa', 'Paket Data', 'Paket Freedom']
    },
    {
      name: 'XL Axiata',
      logo: '🔵',
      color: 'bg-blue-500',
      services: ['Pulsa', 'Paket Data', 'Paket HotRod']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Pulsa & Paket Data</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Masukkan nomor telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Operators */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Pilih Provider</h2>
        
        {operators.map((operator, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${operator.color} text-white text-lg`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{operator.name}</h3>
                {operator.description && (
                  <p className="text-sm text-gray-600">{operator.description}</p>
                )}
              </div>
            </div>
            
            {operator.path ? (
              <Link
                to={operator.path}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-green-50 transition-colors"
              >
                <span className="font-medium text-gray-800">Beli Pulsa</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ) : (
              <div className="space-y-2">
                {operator.services?.map((service, serviceIndex) => (
                  <Link
                    key={serviceIndex}
                    to={`/topup/${operator.name.toLowerCase()}/${service.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{service}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TopUp;
