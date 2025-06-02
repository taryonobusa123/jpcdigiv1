
import React, { useState } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const TelkomselPulsa = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const products = [
    { type: 'Pulsa', amount: 'Rp 5.000', price: 'Rp 6.000' },
    { type: 'Pulsa', amount: 'Rp 10.000', price: 'Rp 11.000' },
    { type: 'Pulsa', amount: 'Rp 25.000', price: 'Rp 26.000' },
    { type: 'Pulsa', amount: 'Rp 50.000', price: 'Rp 51.000' },
    { type: 'Data', amount: '1GB 30 Hari', price: 'Rp 20.000' },
    { type: 'Data', amount: '3GB 30 Hari', price: 'Rp 35.000' },
    { type: 'Data', amount: '8GB 30 Hari', price: 'Rp 55.000' },
    { type: 'Data', amount: '17GB 30 Hari', price: 'Rp 85.000' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/topup" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Telkomsel</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nomor Telepon</h3>
          
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0812xxxxxxxx"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Produk</h3>
          
          <div className="space-y-3">
            {products.map((product, index) => (
              <button
                key={index}
                onClick={() => setSelectedProduct(`${product.amount} - ${product.price}`)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedProduct === `${product.amount} - ${product.price}`
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mb-2">
                      {product.type}
                    </span>
                    <h4 className="font-semibold text-gray-800">{product.amount}</h4>
                  </div>
                  <span className="font-bold text-red-600">{product.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <button className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            Beli Sekarang - {selectedProduct.split(' - ')[1]}
          </button>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TelkomselPulsa;
