
import React from 'react';
import { Bell, User, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xl">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">PPOB Indonesia</h1>
            <p className="text-blue-100 text-sm">Bayar Semua Tagihan Disini</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari layanan..."
              className="pl-10 pr-4 py-2 rounded-lg text-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            <User className="w-5 h-5" />
            <span>Profil</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
