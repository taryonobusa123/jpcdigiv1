
import React from 'react';
import { Home, History, User, Wallet, Grid3X3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Beranda', path: '/' },
    { icon: Grid3X3, label: 'Layanan', path: '/services' },
    { icon: Wallet, label: 'Dompet', path: '/wallet' },
    { icon: History, label: 'Riwayat', path: '/history' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
