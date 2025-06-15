
import React from 'react';
import { Bell, User, Plus, History, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">PPOB Indonesia</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to="/topup-saldo" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </Link>
          
          <Link to="/history" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <History className="w-5 h-5" />
          </Link>
          
          <Link to="/transfer" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <ArrowRightLeft className="w-5 h-5" />
          </Link>
          
          <button className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">3</span>
          </button>
          
          {user ? (
            <Link to="/profile" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/login" className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
