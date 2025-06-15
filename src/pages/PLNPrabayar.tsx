
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const PLNPrabayar = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">PLN Prabayar (Token)</h1>
        </div>
      </div>

      {/* Redirect to new PLN Token page */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Halaman Baru PLN Token
          </h3>
          <p className="text-gray-600 mb-4">
            Kami telah memperbarui halaman pembelian token PLN dengan fitur baru
          </p>
          <Link 
            to="/pln-token"
            className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Beli Token PLN
          </Link>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PLNPrabayar;
