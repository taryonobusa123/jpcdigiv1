
import React from 'react';
import { 
  Bell, 
  CreditCard, 
  Upload, 
  Download, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const QuickActions = () => {
  const quickActions = [
    { icon: Bell, label: 'Tagihan', color: 'bg-orange-500', description: 'Cek tagihan terbaru' },
    { icon: CreditCard, label: 'Pulsa', color: 'bg-purple-500', description: 'Isi pulsa & paket data' },
    { icon: Upload, label: 'Transfer', color: 'bg-blue-500', description: 'Kirim uang' },
    { icon: Download, label: 'Tarik Tunai', color: 'bg-green-500', description: 'Cairkan saldo' },
    { icon: Settings, label: 'Pengaturan', color: 'bg-gray-500', description: 'Kelola akun' },
    { icon: HelpCircle, label: 'Bantuan', color: 'bg-indigo-500', description: 'Pusat bantuan' },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform mb-2`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
            <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
