
import React from 'react';
import { Clock } from 'lucide-react';

const PromoSection = () => {
  const promos = [
    {
      title: 'Cashback 50% Token Listrik',
      description: 'Berlaku untuk pembelian pertama token PLN',
      validUntil: '31 Desember 2024',
      color: 'from-yellow-400 to-orange-500',
      image: '⚡'
    },
    {
      title: 'Gratis Admin Transfer',
      description: 'Transfer ke bank manapun tanpa biaya admin',
      validUntil: '15 Januari 2025',
      color: 'from-blue-400 to-blue-600',
      image: '💸'
    },
    {
      title: 'Bonus Pulsa 10rb',
      description: 'Setiap top up saldo minimal 100rb',
      validUntil: '28 Desember 2024',
      color: 'from-purple-400 to-purple-600',
      image: '📱'
    }
  ];

  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Promo Menarik</h2>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {promos.map((promo, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${promo.color} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex-shrink-0 w-64`}
          >
            <div className="text-3xl mb-2">{promo.image}</div>
            <h3 className="font-bold text-base mb-2">{promo.title}</h3>
            <p className="text-sm opacity-90 mb-3">{promo.description}</p>
            <div className="flex items-center text-xs opacity-80">
              <Clock className="w-3 h-3 mr-1" />
              <span>Berlaku hingga {promo.validUntil}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSection;
