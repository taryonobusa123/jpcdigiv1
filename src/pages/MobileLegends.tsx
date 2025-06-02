
import React, { useState } from 'react';
import { ArrowLeft, Gamepad2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const MobileLegends = () => {
  const [userID, setUserID] = useState('');
  const [zoneID, setZoneID] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const products = [
    { name: '86 Diamonds', price: 'Rp 20.000', discount: null },
    { name: '172 Diamonds', price: 'Rp 40.000', discount: '5%' },
    { name: '257 Diamonds', price: 'Rp 60.000', discount: null },
    { name: '344 Diamonds', price: 'Rp 80.000', discount: '10%' },
    { name: '429 Diamonds', price: 'Rp 100.000', discount: null },
    { name: '514 Diamonds', price: 'Rp 120.000', discount: '15%' },
    { name: '706 Diamonds', price: 'Rp 160.000', discount: null },
    { name: '878 Diamonds', price: 'Rp 200.000', discount: '20%' },
    { name: 'Weekly Diamond Pass', price: 'Rp 27.000', discount: null },
    { name: 'Twilight Pass', price: 'Rp 135.000', discount: 'Popular' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/gaming" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Mobile Legends</h1>
          <Star className="w-5 h-5 text-yellow-300" />
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Akun</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                placeholder="Masukkan User ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone ID
              </label>
              <input
                type="text"
                value={zoneID}
                onChange={(e) => setZoneID(e.target.value)}
                placeholder="Masukkan Zone ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Produk</h3>
          
          <div className="space-y-3">
            {products.map((product, index) => (
              <button
                key={index}
                onClick={() => setSelectedProduct(product)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedProduct?.name === product.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{product.name}</h4>
                    {product.discount && (
                      <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                        product.discount === 'Popular' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {product.discount === 'Popular' ? 'Populer' : `Diskon ${product.discount}`}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-blue-600">{product.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Beli {selectedProduct.name} - {selectedProduct.price}
          </button>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileLegends;
