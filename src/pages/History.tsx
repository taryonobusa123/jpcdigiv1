import React, { useState } from 'react';
import { 
  Calendar, Filter, Search, CheckCircle, Clock, XCircle, 
  ArrowUpRight, ArrowDownLeft, Zap, Smartphone, Wifi, DollarSign
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';

const History = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { data: transactions = [], isLoading, error } = useTransactions();

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'success', label: 'Berhasil' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Gagal' }
  ];

  const getTransactionIcon = (category: string, type: string) => {
    if (category === 'pulsa') return Smartphone;
    if (type.toLowerCase().includes('pln') || type.toLowerCase().includes('listrik')) return Zap;
    if (type.toLowerCase().includes('internet') || type.toLowerCase().includes('wifi')) return Wifi;
    if (type.toLowerCase().includes('transfer')) return ArrowUpRight;
    if (type.toLowerCase().includes('topup') || type.toLowerCase().includes('saldo')) return ArrowDownLeft;
    return DollarSign;
  };

  const getIconColor = (category: string, type: string) => {
    if (category === 'pulsa') return { color: 'text-blue-600', bg: 'bg-blue-100' };
    if (type.toLowerCase().includes('pln') || type.toLowerCase().includes('listrik')) return { color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (type.toLowerCase().includes('internet') || type.toLowerCase().includes('wifi')) return { color: 'text-purple-600', bg: 'bg-purple-100' };
    if (type.toLowerCase().includes('transfer')) return { color: 'text-red-600', bg: 'bg-red-100' };
    if (type.toLowerCase().includes('topup') || type.toLowerCase().includes('saldo')) return { color: 'text-green-600', bg: 'bg-green-100' };
    return { color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
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
        return status ? status : 'Status Tidak Dikenal';
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
        return 'text-yellow-600';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Tampilkan semua status pada tab 'all'
    const matchesTab =
      activeTab === 'all'
        ? true
        : transaction.status === activeTab;

    const matchesSearch =
      transaction.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-gray-800">Riwayat Transaksi</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Login Diperlukan</h3>
          <p className="text-gray-500">Silakan login untuk melihat riwayat transaksi Anda</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-500">Gagal memuat riwayat transaksi</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {transactions.length === 0 ? 'Belum ada transaksi' : 'Tidak ada transaksi'}
            </h3>
            <p className="text-gray-500">
              {transactions.length === 0 
                ? 'Mulai bertransaksi untuk melihat riwayat di sini'
                : 'Coba ubah filter atau kata kunci pencarian'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const IconComponent = getTransactionIcon(transaction.category, transaction.type);
              const iconColors = getIconColor(transaction.category, transaction.type);
              
              return (
                <div key={transaction.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-lg ${iconColors.bg}`}>
                      <IconComponent className={`w-5 h-5 ${iconColors.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{transaction.type}</h4>
                        <span className="font-bold text-sm text-gray-800">
                          {transaction.amount}
                        </span>
                      </div>
                      
                      <p className="text-gray-500 text-xs mb-2">{transaction.description}</p>
                      
                      {transaction.ref_id && (
                        <p className="text-gray-400 text-xs mb-1">ID: {transaction.ref_id}</p>
                      )}
                      
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
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default History;
