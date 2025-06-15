
import React, { useState } from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Notifications = () => {
  const [settings, setSettings] = useState({
    transactionNotif: true,
    promoNotif: true,
    securityNotif: true,
    emailNotif: false,
    smsNotif: true,
    whatsappNotif: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white p-4">
        <div className="flex items-center space-x-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Pengaturan Notifikasi</h1>
        </div>
      </div>

      <div className="p-4 pt-8 space-y-6">
        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jenis Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="transaction" className="text-sm font-medium">
                Notifikasi Transaksi
              </Label>
              <input
                id="transaction"
                type="checkbox"
                checked={settings.transactionNotif}
                onChange={() => handleToggle('transactionNotif')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="promo" className="text-sm font-medium">
                Promo & Penawaran
              </Label>
              <input
                id="promo"
                type="checkbox"
                checked={settings.promoNotif}
                onChange={() => handleToggle('promoNotif')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="security" className="text-sm font-medium">
                Keamanan Akun
              </Label>
              <input
                id="security"
                type="checkbox"
                checked={settings.securityNotif}
                onChange={() => handleToggle('securityNotif')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metode Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <input
                id="email"
                type="checkbox"
                checked={settings.emailNotif}
                onChange={() => handleToggle('emailNotif')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms" className="text-sm font-medium">
                SMS
              </Label>
              <input
                id="sms"
                type="checkbox"
                checked={settings.smsNotif}
                onChange={() => handleToggle('smsNotif')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp" className="text-sm font-medium">
                WhatsApp
              </Label>
              <input
                id="whatsapp"
                type="checkbox"
                checked={settings.whatsappNotif}
                onChange={() => handleToggle('whatsappNotif')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
};

export default Notifications;
