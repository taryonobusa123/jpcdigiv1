
import React, { useState } from 'react';
import { useDataPackages } from '@/hooks/useDataPackages';
import { useDataPackagePurchase } from '@/hooks/useDataPackagePurchase';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import DataPackageHeader from '@/components/data-packages/DataPackageHeader';
import PhoneNumberInput from '@/components/data-packages/PhoneNumberInput';
import PackageSearch from '@/components/data-packages/PackageSearch';
import PackageList from '@/components/data-packages/PackageList';
import PurchaseSummary from '@/components/data-packages/PurchaseSummary';

const DataPackagePurchase = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, profile } = useAuth();
  
  // Data packages filtered only by automatically detected operator
  const { data: packages = [], isLoading } = useDataPackages(detectedOperator);
  const purchaseMutation = useDataPackagePurchase();

  const handleOperatorDetected = (operator: string) => {
    console.log('Operator detected:', operator);
    setDetectedOperator(operator);
    // Tidak perlu reset manual operator, karena tidak ada manual selector sekarang
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
      setDetectedOperator('');
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
      <DataPackageHeader balance={profile?.balance} />

      <div className="p-4 space-y-4">
        <PhoneNumberInput 
          phoneNumber={phoneNumber} 
          setPhoneNumber={setPhoneNumber}
          onOperatorDetected={handleOperatorDetected}
        />

        {packages.length > 0 && (
          <PackageSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        <PackageList 
          packages={filteredPackages}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          isLoading={isLoading}
        />

        {selectedProduct && phoneNumber && (
          <PurchaseSummary 
            selectedProduct={selectedProduct}
            phoneNumber={phoneNumber}
            onPurchase={handlePurchase}
            isPending={purchaseMutation.isPending}
          />
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DataPackagePurchase;

