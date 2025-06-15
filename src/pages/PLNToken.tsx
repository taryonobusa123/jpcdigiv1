import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePlnMeterCheck } from '@/hooks/usePlnMeterCheck';
import { usePlnPurchase } from '@/hooks/usePlnPurchase';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

const PLNToken = () => {
  const { user } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [customerNumber, setCustomerNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [meterData, setMeterData] = useState(null);
  
  const { mutate: checkMeter, isPending: isCheckingMeter } = usePlnMeterCheck();
  const { mutate: purchaseToken, isPending: isPurchasing } = usePlnPurchase();

  const amounts = [
    { display: 'Rp 20.000', value: 20000 },
    { display: 'Rp 50.000', value: 50000 },
    { display: 'Rp 100.000', value: 100000 },
    { display: 'Rp 200.000', value: 200000 },
    { display: 'Rp 500.000', value: 500000 },
    { display: 'Rp 1.000.000', value: 1000000 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleCheckMeter = async () => {
    if (!customerNumber.trim()) return;

    checkMeter(customerNumber, {
      onSuccess: (data) => {
        if (data.success && data.data) {
          setMeterData(data.data);
        }
      }
    });
  };

  const handlePurchase = async () => {
    if (!customerNumber || !selectedAmount || !user || !meterData) return;

    purchaseToken({
      customer_id: customerNumber,
      amount: parseInt(selectedAmount),
      admin_fee: 2500,
      customer_name: meterData.customer_name
    }, {
      onSuccess: () => {
        // Reset form after successful purchase
        setCustomerNumber('');
        setSelectedAmount('');
        setMeterData(null);
      }
    });
  };

  if (isPageLoading) {
    return <LoadingScreen message="Memuat halaman PLN Token..." />;
  }

  if (isPurchasing) {
    return <LoadingScreen message="Memproses pembelian token..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">PLN Token (Prabayar)</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Meter/ID Pelanggan</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Masukkan nomor meter atau ID pelanggan"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            
            <button
              onClick={handleCheckMeter}
              disabled={!customerNumber.trim() || isCheckingMeter}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-300"
            >
              {isCheckingMeter ? 'Mengecek...' : 'Cek Data Meter'}
            </button>
          </div>
        </div>

        {meterData && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Pelanggan</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama</span>
                <span className="font-medium">{meterData.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarif/Daya</span>
                <span className="font-medium">{meterData.segment_power}</span>
              </div>
            </div>
          </div>
        )}

        {meterData && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Nominal</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {amounts.map((amount, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAmount(amount.value.toString())}
                  className={`p-4 rounded-lg border-2 text-center font-semibold transition-colors ${
                    selectedAmount === amount.value.toString()
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  {amount.display}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedAmount && meterData && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pembelian</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Token PLN</span>
                <span className="font-medium">Rp {parseInt(selectedAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">Rp 2.500</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Bayar</span>
                <span className="text-yellow-600">
                  Rp {(parseInt(selectedAmount) + 2500).toLocaleString()}
                </span>
              </div>
            </div>
            
            <button
              onClick={handlePurchase}
              disabled={!user}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mt-4 disabled:bg-gray-300"
            >
              {!user ? 'Login untuk Membeli' : 'Beli Token'}
            </button>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Token akan dikirim via SMS ke nomor terdaftar</li>
                <li>• Pastikan nomor meter/ID pelanggan sudah benar</li>
                <li>• Token berlaku selama 3 bulan sejak pembelian</li>
                <li>• Simpan struk sebagai bukti pembelian</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PLNToken;
