
import React, { useState } from 'react';
import { ArrowLeft, Smartphone, Wifi, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDataPackages, useDataOperators } from '@/hooks/useDataPackages';
import { useDataPackagePurchase } from '@/hooks/useDataPackagePurchase';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';

const DataPackagePurchase = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, profile } = useAuth();
  const { data: operators = [] } = useDataOperators();
  const { data: packages = [], isLoading } = useDataPackages(selectedOperator);
  const purchaseMutation = useDataPackagePurchase();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'telkomsel': return 'bg-red-500';
      case 'xl': return 'bg-blue-500';
      case 'indosat': return 'bg-yellow-500';
      case 'tri': return 'bg-purple-500';
      case 'smartfren': return 'bg-pink-500';
      case 'axis': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePurchase = async () => {
    if (!selectedProduct || !phoneNumber) return;

    try {
      await purchaseMutation.mutateAsync({
        phone_number: phoneNumber,
        operator: selectedProduct.brand,
        product_id: selectedProduct.id,
        product_name: selectedProduct.product_name,
        description: selectedProduct.description,
        price: selectedProduct.buyer_price,
        sku: selectedProduct.sku,
      });

      // Reset form after successful purchase
      setPhoneNumber('');
      setSelectedProduct(null);
      setSelectedOperator('');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/topup" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <Wifi className="w-6 h-6" />
            <h1 className="text-xl font-bold">Paket Data</h1>
          </div>
        </div>
        
        {user && profile && (
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Saldo Anda</span>
              <span className="font-bold">{formatPrice(profile.balance)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Phone Number Input */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <Label htmlFor="phone" className="text-base font-semibold text-gray-800 mb-2 block">
            Nomor Telepon
          </Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0812xxxxxxxx"
              className="pl-10"
            />
          </div>
        </div>

        {/* Operator Selection */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Pilih Provider</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedOperator === '' ? 'default' : 'outline'}
              onClick={() => setSelectedOperator('')}
              className="h-12"
            >
              Semua Operator
            </Button>
            {operators.map((operator) => (
              <Button
                key={operator}
                variant={selectedOperator === operator ? 'default' : 'outline'}
                onClick={() => setSelectedOperator(operator)}
                className="h-12"
              >
                {operator}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        {packages.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari paket data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Package Selection */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Memuat paket data...</p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Pilih Paket Data</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedProduct(pkg)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedProduct?.id === pkg.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getBrandColor(pkg.brand)}`}>
                          {pkg.brand.toUpperCase()}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {pkg.type}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">{pkg.product_name}</h4>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                    </div>
                    <div className="text-right ml-3">
                      <span className="font-bold text-purple-600 text-lg">
                        {formatPrice(pkg.buyer_price)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : packages.length === 0 && !isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Paket data tidak tersedia</p>
          </div>
        ) : null}

        {/* Purchase Button */}
        {selectedProduct && phoneNumber && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Ringkasan Pembelian</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nomor</span>
                  <span>{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket</span>
                  <span>{selectedProduct.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider</span>
                  <span>{selectedProduct.brand}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-purple-600">{formatPrice(selectedProduct.buyer_price)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handlePurchase}
              disabled={purchaseMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {purchaseMutation.isPending ? 'Memproses...' : 'Beli Sekarang'}
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DataPackagePurchase;
