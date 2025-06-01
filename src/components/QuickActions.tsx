
import React from 'react';
import { 
  Zap, 
  Smartphone, 
  ArrowUpRight, 
  Wallet, 
  Gamepad2, 
  Shield,
  Plus,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    { icon: Zap, label: 'Bayar Tagihan', color: 'bg-yellow-500', path: '/pay-bills' },
    { icon: Smartphone, label: 'Pulsa/Data', color: 'bg-green-500', path: '/topup' },
    { icon: ArrowUpRight, label: 'Transfer', color: 'bg-blue-500', path: '/transfer' },
    { icon: Wallet, label: 'E-Wallet', color: 'bg-purple-500', path: '/ewallet' },
    { icon: Gamepad2, label: 'Gaming', color: 'bg-indigo-500', path: '/gaming' },
    { icon: Shield, label: 'BPJS', color: 'bg-red-500', path: '/insurance' },
    { icon: Plus, label: 'Top Up', color: 'bg-orange-500', path: '/wallet' },
    { icon: CreditCard, label: 'Lainnya', color: 'bg-gray-500', path: '/services' },
  ];

  return (
    <div className="bg-white mx-4 rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
          >
            <div className={`p-3 rounded-lg ${action.color}`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
