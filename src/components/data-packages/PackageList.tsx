
import React from 'react';
import { Wifi } from 'lucide-react';

interface Package {
  id: string;
  brand: string;
  type: string;
  product_name: string;
  description: string;
  buyer_price: number;
}

interface PackageListProps {
  packages: Package[];
  selectedProduct: Package | null;
  setSelectedProduct: (product: Package) => void;
  isLoading: boolean;
}

const PackageList = ({ packages, selectedProduct, setSelectedProduct, isLoading }: PackageListProps) => {
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Memuat paket data...</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Paket data tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Pilih Paket Data</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {packages.map((pkg) => (
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
  );
};

export default PackageList;
