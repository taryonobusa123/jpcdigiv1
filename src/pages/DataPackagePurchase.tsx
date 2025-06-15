
import React, { useState } from 'react';
import { useDataPackages, useDataOperators } from '@/hooks/useDataPackages';
import { useDataPackagePurchase } from '@/hooks/useDataPackagePurchase';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import DataPackageHeader from '@/components/data-packages/DataPackageHeader';
import PhoneNumberInput from '@/components/data-packages/PhoneNumberInput';
import OperatorSelector from '@/components/data-packages/OperatorSelector';
import PackageSearch from '@/components/data-packages/PackageSearch';
import PackageList from '@/components/data-packages/PackageList';
import PurchaseSummary from '@/components/data-packages/PurchaseSummary';

const DataPackagePurchase = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [detectedOperator, setDetectedOperator] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, profile } = useAuth();
  const { data: operators = [] } = useDataOperators();
  
  // Use detected operator if no manual selection, otherwise use selected operator
  const effectiveOperator = selectedOperator || detectedOperator;
  const { data: packages = [], isLoading } = useDataPackages(effectiveOperator);
  const purchaseMutation = useDataPackagePurchase();

  const handleOperatorDetected = (operator: string) => {
    console.log('Operator detected:', operator);
    setDetectedOperator(operator);
    // Reset manual selection when operator is auto-detected
    if (operator) {
      setSelectedOperator('');
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

        <OperatorSelector 
          operators={operators}
          selectedOperator={selectedOperator}
          setSelectedOperator={setSelectedOperator}
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
