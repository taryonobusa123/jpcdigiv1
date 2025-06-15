
import React from 'react';
import { Gift, ArrowLeft, Star, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Rewards = () => {
  const rewards = [
    {
      id: 1,
      name: 'Voucher Pulsa 10K',
      points: 500,
      category: 'Pulsa',
      icon: Zap,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      name: 'Cashback 5K',
      points: 300,
      category: 'Cashback',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 3,
      name: 'Token PLN 20K',
      points: 800,
      category: 'PLN',
      icon: Trophy,
      color: 'bg-green-100 text-green-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4">
        <div className="flex items-center space-x-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Reward & Poin</h1>
        </div>
      </div>

      <div className="p-4 pt-8">
        {/* Points Balance */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6 text-center">
            <Gift className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">1,250 Poin</h2>
            <p className="text-purple-100">Poin yang dapat ditukar</p>
          </CardContent>
        </Card>

        {/* Reward Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Kategori Hadiah</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="flex flex-col p-4 h-auto">
              <Zap className="w-6 h-6 mb-2" />
              <span className="text-xs">Pulsa</span>
            </Button>
            <Button variant="outline" className="flex flex-col p-4 h-auto">
              <Star className="w-6 h-6 mb-2" />
              <span className="text-xs">Cashback</span>
            </Button>
            <Button variant="outline" className="flex flex-col p-4 h-auto">
              <Trophy className="w-6 h-6 mb-2" />
              <span className="text-xs">Voucher</span>
            </Button>
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Hadiah Tersedia</h3>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${reward.color}`}>
                      <reward.icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{reward.name}</h4>
                      <p className="text-sm text-gray-500">{reward.category}</p>
                      <p className="text-sm font-medium text-purple-600">{reward.points} poin</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      disabled={1250 < reward.points}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Tukar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Earn Points */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Cara Mendapat Poin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Setiap transaksi = 10 poin</p>
              <p>• Login harian = 5 poin</p>
              <p>• Ajak teman = 100 poin</p>
              <p>• Review aplikasi = 50 poin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;
