
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePulsaProducts } from '@/hooks/usePulsaProducts';
import { usePulsaPurchase } from '@/hooks/usePulsaPurchase';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

const PulsaPurchase = () => {
  const { user } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detectedOperator, setDetectedOperator] = useState('');
  
  const { data: products, isLoading: isLoadingProducts } = usePulsaProducts();
  const { purchasePulsa, isLoading: isPurchasing } = usePulsaPurchase();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phoneNumber.length >= 4) {
      const prefix = phoneNumber.substring(0, 4);
      
      if (['0811', '0812', '0813', '0821', '0822', '0851', '0852', '0853'].includes(prefix)) {
        setDetectedOperator('TELKOMSEL');
      } else if (['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix)) {
        setDetectedOperator('INDOSAT');
      } else if (['0817', '0818', '0819', '0859', '0877', '0878'].includes(prefix)) {
        setDetectedOperator('XL');
      } else if (['0838', '0831', '0832', '0833'].includes(prefix)) {
        setDetectedOperator('AXIS');
      } else if (['0895', '0896', '0897', '0898', '0899'].includes(prefix)) {
        setDetectedOperator('THREE');
      } else if (['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888'].includes(prefix)) {
        setDetectedOperator('SMARTFREN');
      } else {
        setDetectedOperator('');
      }
    } else {
      setDetectedOperator('');
    }
  }, [phoneNumber]);

  const handlePurchase = async () => {
    if (!phoneNumber || !selectedProduct || !user) return;

    try {
      await purchasePulsa({
        phone_number: phoneNumber,
        product_code: selectedProduct.buyer_sku_code,
        amount: selectedProduct.price
      });
      
      // Reset form after successful purchase
      setPhoneNumber('');
      setSelectedProduct(null);
      setDetectedOperator('');
    } catch (error) {
      console.error('Error purchasing pulsa:', error);
    }
  };

  if (isPageLoading) {
    return <LoadingScreen message="Memuat halaman pulsa..." />;
  }

  if (isPurchasing) {
    return <LoadingScreen message="Memproses pembelian pulsa..." />;
  }

  const filteredProducts = products?.filter(product => 
    product.category === 'Pulsa' && 
    (detectedOperator ? product.brand === detectedOperator : true)
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/topup" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Beli Pulsa</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Telepon</h3>
          
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {detectedOperator && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                  {detectedOperator}
                </span>
              </div>
            )}
          </div>
        </div>

        {phoneNumber && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Nominal Pulsa</h3>
            
            {isLoadingProducts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Memuat produk...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProducts.map((product, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedProduct(product)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedProduct?.buyer_sku_code === product.buyer_sku_code
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                            {product.brand}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800">{product.product_name}</h4>
                        <p className="text-sm text-gray-500">{product.desc || 'Pulsa reguler'}</p>
                      </div>
                      <span className="font-bold text-green-600">
                        Rp {product.price?.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {detectedOperator 
                        ? `Produk ${detectedOperator} tidak tersedia` 
                        : 'Masukkan nomor yang valid untuk melihat produk'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedProduct && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pembelian</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nomor Tujuan</span>
                <span className="font-medium">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produk</span>
                <span className="font-medium">{selectedProduct.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Harga</span>
                <span className="font-medium">Rp {selectedProduct.price?.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Bayar</span>
                <span className="text-green-600">Rp {selectedProduct.price?.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={handlePurchase}
              disabled={!user}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-4 disabled:bg-gray-300"
            >
              {!user ? 'Login untuk Membeli' : 'Beli Sekarang'}
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PulsaPurchase;
