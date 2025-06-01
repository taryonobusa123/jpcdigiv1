
import React from 'react';
import { ArrowLeft, Shield, Heart, Car, Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const Insurance = () => {
  const insuranceTypes = [
    {
      title: 'BPJS Kesehatan',
      description: 'Bayar iuran BPJS Kesehatan bulanan',
      icon: Heart,
      color: 'bg-green-500',
      path: '/insurance/bpjs-kesehatan',
      popular: true
    },
    {
      title: 'BPJS Ketenagakerjaan',
      description: 'Bayar iuran BPJS Ketenagakerjaan',
      icon: Shield,
      color: 'bg-blue-500',
      path: '/insurance/bpjs-ketenagakerjaan',
      popular: true
    },
    {
      title: 'Asuransi Kendaraan',
      description: 'Bayar premi asuransi mobil & motor',
      icon: Car,
      color: 'bg-red-500',
      path: '/insurance/vehicle'
    },
    {
      title: 'Asuransi Rumah',
      description: 'Bayar premi asuransi properti',
      icon: Home,
      color: 'bg-purple-500',
      path: '/insurance/property'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">BPJS & Asuransi</h1>
        </div>
      </div>

      {/* Insurance Types */}
      <div className="p-4 space-y-4">
        {insuranceTypes.map((insurance, index) => (
          <Link
            key={index}
            to={insurance.path}
            className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 hover:bg-green-50 transition-colors active:scale-95"
          >
            <div className={`p-3 rounded-lg ${insurance.color}`}>
              <insurance.icon className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-800">{insurance.title}</h4>
                {insurance.popular && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                    Populer
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{insurance.description}</p>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Pastikan nomor peserta BPJS aktif</li>
                <li>• Pembayaran iuran dapat dilakukan H-10 sampai H+7</li>
                <li>• Simpan bukti pembayaran untuk klaim</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pembayaran Terakhir</h3>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="space-y-3">
              {[
                { type: 'BPJS Kesehatan', period: 'Januari 2024', amount: 'Rp 42.000', status: 'Berhasil' },
                { type: 'BPJS Ketenagakerjaan', period: 'Desember 2023', amount: 'Rp 16.800', status: 'Berhasil' }
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{payment.type}</h4>
                    <p className="text-gray-500 text-sm">{payment.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{payment.amount}</p>
                    <span className="text-green-600 text-xs">{payment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Insurance;
