
import React, { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const BPJSKesehatan = () => {
  const [participantNumber, setParticipantNumber] = useState('');
  const [billInfo, setBillInfo] = useState<null | {
    name: string;
    class: string;
    participants: number;
    period: string;
    amount: string;
    adminFee: string;
  }>(null);

  const handleCheck = () => {
    setBillInfo({
      name: 'John Doe',
      class: 'Kelas I',
      participants: 4,
      period: 'Februari 2024',
      amount: 'Rp 168.000',
      adminFee: 'Rp 2.500'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/insurance" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">BPJS Kesehatan</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Peserta</h3>
          <input
            type="text"
            value={participantNumber}
            onChange={(e) => setParticipantNumber(e.target.value)}
            placeholder="Masukkan nomor peserta BPJS"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
          />
          <button
            onClick={handleCheck}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Cek Iuran
          </button>
        </div>

        {billInfo && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Iuran</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama Peserta</span>
                <span className="font-medium">{billInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kelas Perawatan</span>
                <span className="font-medium">{billInfo.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Peserta</span>
                <span className="font-medium">{billInfo.participants} orang</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Periode</span>
                <span className="font-medium">{billInfo.period}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-gray-600">Iuran BPJS</span>
                <span className="font-medium">{billInfo.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">{billInfo.adminFee}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Bayar</span>
                <span className="text-green-600">Rp 170.500</span>
              </div>
            </div>
            <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-4">
              Bayar Iuran
            </button>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Iuran dapat dibayar H-10 sampai H+7</li>
            <li>• Denda 2% per bulan untuk keterlambatan</li>
            <li>• Layanan akan diaktifkan 24 jam setelah pembayaran</li>
          </ul>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default BPJSKesehatan;
