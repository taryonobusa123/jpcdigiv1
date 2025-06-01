
import React, { useState } from 'react';
import { ArrowLeft, Gamepad2, Search, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const Gaming = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const games = [
    {
      name: 'Mobile Legends',
      category: 'MOBA',
      logo: '⚔️',
      color: 'bg-blue-600',
      products: ['Diamond ML', 'Weekly Diamond Pass', 'Starlight Member'],
      popular: true
    },
    {
      name: 'Free Fire',
      category: 'Battle Royale',
      logo: '🔥',
      color: 'bg-orange-500',
      products: ['Diamond FF', 'Level Up Pass', 'Monthly Membership'],
      popular: true
    },
    {
      name: 'PUBG Mobile',
      category: 'Battle Royale',
      logo: '🎯',
      color: 'bg-yellow-600',
      products: ['UC PUBG', 'Royale Pass', 'Prime Subscription'],
      popular: false
    },
    {
      name: 'Genshin Impact',
      category: 'RPG',
      logo: '⭐',
      color: 'bg-purple-500',
      products: ['Genesis Crystal', 'Blessing of Welkin Moon', 'Battle Pass'],
      popular: false
    },
    {
      name: 'Steam Wallet',
      category: 'PC Gaming',
      logo: '🎮',
      color: 'bg-gray-700',
      products: ['Steam Wallet IDR', 'Steam Gift Card'],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Voucher Gaming</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari game favorit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Popular Games */}
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 Game Populer</h2>
          <div className="grid grid-cols-2 gap-3">
            {games.filter(game => game.popular).map((game, index) => (
              <Link
                key={index}
                to={`/gaming/${game.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all active:scale-95"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${game.color} text-white text-lg`}>
                    <span>{game.logo}</span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{game.name}</h4>
                <p className="text-gray-500 text-xs">{game.category}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* All Games */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Semua Game</h2>
          
          {games.map((game, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2.5 rounded-lg ${game.color} text-white text-lg`}>
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
                    {game.popular && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  </div>
                  <p className="text-gray-500 text-sm">{game.category}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {game.products.map((product, productIndex) => (
                  <Link
                    key={productIndex}
                    to={`/gaming/${game.name.toLowerCase().replace(/\s+/g, '-')}/${product.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{product}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Gaming;
