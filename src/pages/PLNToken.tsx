
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePlnMeterCheck } from '@/hooks/usePlnMeterCheck';
import { usePlnPurchase } from '@/hooks/usePlnPurchase';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';
import PLNMeterCheck from '../components/pln/PLNMeterCheck';
import PLNCustomerData from '../components/pln/PLNCustomerData';
import PLNAmountSelector from '../components/pln/PLNAmountSelector';
import PLNPurchaseSummary from '../components/pln/PLNPurchaseSummary';
import PLNInformation from '../components/pln/PLNInformation';

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
        <PLNMeterCheck
          customerNumber={customerNumber}
          setCustomerNumber={setCustomerNumber}
          onCheckMeter={handleCheckMeter}
          isCheckingMeter={isCheckingMeter}
        />

        {meterData && (
          <PLNCustomerData meterData={meterData} />
        )}

        {meterData && (
          <PLNAmountSelector
            amounts={amounts}
            selectedAmount={selectedAmount}
            onSelectAmount={setSelectedAmount}
          />
        )}

        {selectedAmount && meterData && (
          <PLNPurchaseSummary
            selectedAmount={selectedAmount}
            meterData={meterData}
            onPurchase={handlePurchase}
            user={user}
          />
        )}

        <PLNInformation />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PLNToken;
