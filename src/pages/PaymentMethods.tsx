
import React from 'react';
import { CreditCard, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentMethods = () => {
  const paymentMethods = [
    {
      id: 1,
      type: 'Bank Transfer',
      name: 'BCA',
      number: '**** **** **** 1234',
      isDefault: true,
    },
    {
      id: 2,
      type: 'E-Wallet',
      name: 'GoPay',
      number: '+62812****5678',
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4">
        <div className="flex items-center space-x-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Metode Pembayaran</h1>
        </div>
      </div>

      <div className="p-4 pt-8">
        {/* Add Payment Method */}
        <Button className="w-full mb-6 bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Metode Pembayaran
        </Button>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.type}</p>
                    <p className="text-sm text-gray-600">{method.number}</p>
                  </div>
                  
                  {method.isDefault && (
                    <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                      Default
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <Card className="text-center p-8">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Belum ada metode pembayaran
            </h3>
            <p className="text-gray-500 mb-4">
              Tambahkan metode pembayaran untuk memudahkan transaksi
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
