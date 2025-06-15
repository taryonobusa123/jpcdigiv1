
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePlnProducts } from '@/hooks/usePlnProducts';
import { usePlnMeterCheck } from '@/hooks/usePlnMeterCheck';
import { usePlnDirectPurchase } from '@/hooks/usePlnDirectPurchase';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';
import PLNMeterCheck from '../components/pln/PLNMeterCheck';
import PLNCustomerData from '../components/pln/PLNCustomerData';
import PLNProductList from '../components/pln/PLNProductList';
import PLNPurchaseConfirmation from '../components/pln/PLNPurchaseConfirmation';
import PLNInformation from '../components/pln/PLNInformation';

const PLNToken = () => {
  const { user } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [meterNumber, setMeterNumber] = useState('');
  const [meterData, setMeterData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { data: plnProducts, isLoading: isProductsLoading } = usePlnProducts();
  const { mutate: checkMeter, isPending: isCheckingMeter } = usePlnMeterCheck();
  const { mutate: purchaseToken, isPending: isPurchasing } = usePlnDirectPurchase();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleMeterNumberChange = (value: string) => {
    setMeterNumber(value);
    // Reset meter data when number changes
    if (meterData) {
      setMeterData(null);
    }
  };

  const handleCheckMeter = () => {
    if (!meterNumber.trim()) return;

    checkMeter(meterNumber, {
      onSuccess: (data) => {
        if (data.success && data.data) {
          setMeterData({
            customer_name: data.data.customer_name,
            segment_power: data.data.tarif || data.data.power || 'R1/900VA'
          });
        }
      }
    });
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedProduct || !meterNumber.trim() || !user) return;

    purchaseToken({
      meter_number: meterNumber,
      product_id: selectedProduct.id,
      product_name: selectedProduct.product_name,
      price: selectedProduct.buyer_price,
      sku: selectedProduct.buyer_sku_code
    });

    setShowConfirmation(false);
    setSelectedProduct(null);
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
          onCheckMeter={handleCheckMeter}
          isCheckingMeter={isCheckingMeter}
        />

        {meterData && (
          <PLNCustomerData meterData={meterData} />
        )}

        {meterNumber.trim() && plnProducts && (
          <PLNProductList
            products={plnProducts}
            meterNumber={meterNumber}
            onPurchase={handleProductSelect}
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

      {/* Purchase Confirmation Modal */}
      <PLNPurchaseConfirmation
        product={selectedProduct}
        meterNumber={meterNumber}
        meterData={meterData}
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirmPurchase={handleConfirmPurchase}
        isLoading={isPurchasing}
      />

      <BottomNavigation />
    </div>
  );
};

export default PLNToken;
