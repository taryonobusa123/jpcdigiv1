
import React, { useState } from 'react';
import { ArrowLeft, Smartphone, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNavigation from '@/components/BottomNavigation';
import { usePulsaProducts, usePulsaOperators } from '@/hooks/usePulsaProducts';
import { usePulsaPurchase } from '@/hooks/usePulsaPurchase';
import { useAuth } from '@/hooks/useAuth';

const PulsaPurchase = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const { user, profile } = useAuth();
  const { data: operators, isLoading: operatorsLoading } = usePulsaOperators();
  const { data: products, isLoading: productsLoading } = usePulsaProducts(selectedOperator);
  const pulsaPurchase = usePulsaPurchase();

  const handlePurchase = () => {
    console.log('Purchase button clicked');
    console.log('Selected product:', selectedProduct);
    console.log('Phone number:', phoneNumber);
    console.log('User:', user);
    console.log('Profile balance:', profile?.balance);

    if (!selectedProduct || !phoneNumber.trim()) {
      alert('Silakan lengkapi nomor telepon dan pilih nominal pulsa');
      return;
    }

    if (!user) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    if (!profile || profile.balance < selectedProduct.price) {
      alert('Saldo tidak mencukupi untuk melakukan pembelian');
      return;
    }

    console.log('Starting purchase mutation...');
    pulsaPurchase.mutate({
      phone_number: phoneNumber,
      operator: selectedOperator,
      product_id: selectedProduct.id,
      product_name: selectedProduct.product_name,
      nominal: selectedProduct.nominal,
      price: selectedProduct.price,
      sku: selectedProduct.buyer_sku_code,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const detectOperator = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('0811') || cleanPhone.startsWith('0812') || 
        cleanPhone.startsWith('0813') || cleanPhone.startsWith('0821') ||
        cleanPhone.startsWith('0822') || cleanPhone.startsWith('0823') ||
        cleanPhone.startsWith('0851') || cleanPhone.startsWith('0852') ||
        cleanPhone.startsWith('0853')) {
      return 'Telkomsel';
    } else if (cleanPhone.startsWith('0814') || cleanPhone.startsWith('0815') ||
               cleanPhone.startsWith('0816') || cleanPhone.startsWith('0855') ||
               cleanPhone.startsWith('0856') || cleanPhone.startsWith('0857') ||
               cleanPhone.startsWith('0858')) {
      return 'Indosat';
    } else if (cleanPhone.startsWith('0817') || cleanPhone.startsWith('0818') ||
               cleanPhone.startsWith('0819') || cleanPhone.startsWith('0859') ||
               cleanPhone.startsWith('0877') || cleanPhone.startsWith('0878')) {
      return 'XL';
    } else if (cleanPhone.startsWith('0895') || cleanPhone.startsWith('0896') ||
               cleanPhone.startsWith('0897') || cleanPhone.startsWith('0898') ||
               cleanPhone.startsWith('0899')) {
      return 'Tri';
    } else if (cleanPhone.startsWith('0881') || cleanPhone.startsWith('0882') ||
               cleanPhone.startsWith('0883') || cleanPhone.startsWith('0884') ||
               cleanPhone.startsWith('0885') || cleanPhone.startsWith('0886') ||
               cleanPhone.startsWith('0887') || cleanPhone.startsWith('0888') ||
               cleanPhone.startsWith('0889')) {
      return 'Smartfren';
    }
    return '';
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    const detectedOperator = detectOperator(value);
    if (detectedOperator && detectedOperator !== selectedOperator) {
      setSelectedOperator(detectedOperator);
      setSelectedProduct(null);
    }
  };

  const isFormValid = selectedProduct && phoneNumber.trim() && user;
  const hasSufficientBalance = profile && profile.balance >= (selectedProduct?.price || 0);

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

      <div className="p-4 space-y-4">
        {/* User Balance */}
        {profile && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-800">Saldo Anda</span>
              </div>
              <span className="font-bold text-green-600">
                {formatCurrency(profile.balance)}
              </span>
            </div>
          </div>
        )}

        {/* Login Notice */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 text-sm">
              Silakan login terlebih dahulu untuk melakukan pembelian pulsa.
            </p>
          </div>
        )}

        {/* Phone Number Input */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <Label htmlFor="phone" className="text-lg font-semibold text-gray-800 mb-4 block">
            Nomor Telepon
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="0812xxxxxxxx"
            className="text-lg"
          />
          {selectedOperator && (
            <div className="mt-2">
              <span className="inline-block bg-green-100 text-green-600 text-sm px-2 py-1 rounded-full">
                {selectedOperator} terdeteksi
              </span>
            </div>
          )}
        </div>

        {/* Operator Selection */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Operator</h3>
          
          {operatorsLoading ? (
            <div className="text-center py-4">Loading operators...</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {operators?.map((operator) => (
                <button
                  key={operator}
                  onClick={() => {
                    console.log('Operator selected:', operator);
                    setSelectedOperator(operator);
                    setSelectedProduct(null);
                  }}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    selectedOperator === operator
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <span className="font-medium text-gray-800">{operator}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Selection */}
        {selectedOperator && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Nominal</h3>
            
            {productsLoading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : (
              <div className="space-y-3">
                {products?.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      console.log('Product selected:', product);
                      setSelectedProduct(product);
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {formatCurrency(product.nominal)}
                        </h4>
                        <p className="text-sm text-gray-600">{product.product_name}</p>
                      </div>
                      <span className="font-bold text-green-600">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Purchase Summary & Button */}
        {selectedProduct && phoneNumber && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Detail Pembelian:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Nomor: {phoneNumber}</p>
                <p>Operator: {selectedOperator}</p>
                <p>Nominal: {formatCurrency(selectedProduct.nominal)}</p>
                <p>Harga: {formatCurrency(selectedProduct.price)}</p>
              </div>
            </div>

            {/* Balance warning */}
            {profile && !hasSufficientBalance && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  Saldo tidak mencukupi. Saldo Anda: {formatCurrency(profile.balance)}, 
                  diperlukan: {formatCurrency(selectedProduct.price)}
                </p>
              </div>
            )}
            
            <Button
              onClick={handlePurchase}
              disabled={pulsaPurchase.isPending || !isFormValid || !hasSufficientBalance}
              className={`w-full py-3 text-lg font-semibold transition-colors ${
                pulsaPurchase.isPending || !isFormValid || !hasSufficientBalance
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {pulsaPurchase.isPending 
                ? 'Memproses...' 
                : !user
                ? 'Login Diperlukan'
                : !hasSufficientBalance
                ? 'Saldo Tidak Mencukupi'
                : `Beli Sekarang - ${formatCurrency(selectedProduct.price)}`
              }
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PulsaPurchase;
