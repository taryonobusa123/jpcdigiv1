
import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🤔</span>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </Link>
          
          <div className="block">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Sebelumnya</span>
            </button>
          </div>
        </div>
        
        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Layanan Populer:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/pay-bills" className="text-blue-600 text-sm hover:underline">Bayar Tagihan</Link>
            <Link to="/topup" className="text-blue-600 text-sm hover:underline">Pulsa/Data</Link>
            <Link to="/transfer" className="text-blue-600 text-sm hover:underline">Transfer</Link>
            <Link to="/wallet" className="text-blue-600 text-sm hover:underline">Dompet</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
