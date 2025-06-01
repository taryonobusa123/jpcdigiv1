
import React, { useState } from 'react';
import { 
  Calendar, Filter, Search, CheckCircle, Clock, XCircle, 
  ArrowUpRight, ArrowDownLeft, Zap, Smartphone, Wifi
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';

const History = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    {
      id: '1',
      type: 'PLN Token',
      category: 'listrik',
      amount: '-Rp 100.000',
      status: 'success',
      date: '2024-01-15',
      time: '14:30',
      icon: Zap,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      description: 'Token Listrik 20 Digit'
    },
    {
      id: '2',
      type: 'Top Up Saldo',
      category: 'topup',
      amount: '+Rp 500.000',
      status: 'success',
      date: '2024-01-15',
      time: '10:15',
      icon: ArrowDownLeft,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      description: 'Transfer dari BCA'
    },
    {
      id: '3',
      type: 'Pulsa Telkomsel',
      category: 'pulsa',
      amount: '-Rp 25.000',
      status: 'success',
      date: '2024-01-14',
      time: '16:45',
      icon: Smartphone,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      description: '0812-3456-7890'
    },
    {
      id: '4',
      type: 'IndiHome',
      category: 'internet',
      amount: '-Rp 350.000',
      status: 'pending',
      date: '2024-01-14',
      time: '09:20',
      icon: Wifi,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      description: 'Tagihan Bulan Januari'
    },
    {
      id: '5',
      type: 'Transfer Bank',
      category: 'transfer',
      amount: '-Rp 200.000',
      status: 'failed',
      date: '2024-01-13',
      time: '20:10',
      icon: ArrowUpRight,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      description: 'Transfer ke BNI'
    },
    {
      id: '6',
      type: 'BPJS Kesehatan',
      category: 'bpjs',
      amount: '-Rp 42.000',
      status: 'success',
      date: '2024-01-13',
      time: '11:30',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      description: 'Iuran Bulanan'
    }
  ];

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'success', label: 'Berhasil' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Gagal' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Berhasil';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Gagal';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === 'all' || transaction.status === activeTab;
    const matchesSearch = transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tidak ada transaksi</h3>
            <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg ${transaction.iconBg}`}>
                    <transaction.icon className={`w-5 h-5 ${transaction.iconColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{transaction.type}</h4>
                      <span className={`font-bold text-sm ${
                        transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-800'
                      }`}>
                        {transaction.amount}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-xs mb-2">{transaction.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        {transaction.date} • {transaction.time}
                      </span>
                      <div className={`flex items-center space-x-1 ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="text-xs font-medium">{getStatusText(transaction.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default History;
