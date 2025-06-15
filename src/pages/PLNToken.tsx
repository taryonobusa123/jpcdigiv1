
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePlnProducts } from '@/hooks/usePlnProducts';
import { usePlnDirectPurchase } from '@/hooks/usePlnDirectPurchase';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';
import PLNMeterCheck from '../components/pln/PLNMeterCheck';
import PLNProductList from '../components/pln/PLNProductList';
import PLNInformation from '../components/pln/PLNInformation';

const PLNToken = () => {
  const { user } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [meterNumber, setMeterNumber] = useState('');
  
  const { data: plnProducts, isLoading: isProductsLoading } = usePlnProducts();
  const { mutate: purchaseToken, isPending: isPurchasing } = usePlnDirectPurchase();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleMeterNumberChange = (value: string) => {
    setMeterNumber(value);
  };

  const handlePurchase = (product: any) => {
    if (!meterNumber.trim() || !user) return;

    purchaseToken({
      meter_number: meterNumber,
      product_id: product.id,
      product_name: product.product_name,
      price: product.buyer_price,
      sku: product.buyer_sku_code
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
          customerNumber={meterNumber}
          setCustomerNumber={handleMeterNumberChange}
          onCheckMeter={() => {}} // Not needed for direct purchase
          isCheckingMeter={false}
        />

        {meterNumber.trim() && plnProducts && (
          <PLNProductList
            products={plnProducts}
            meterNumber={meterNumber}
            onPurchase={handlePurchase}
            isLoading={isPurchasing}
          />
        )}

        {isProductsLoading && meterNumber.trim() && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat produk PLN...</p>
          </div>
        )}

        <PLNInformation />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PLNToken;
