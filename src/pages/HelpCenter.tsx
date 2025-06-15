
import React, { useState } from 'react';
import { Phone, ArrowLeft, MessageCircle, Mail, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Akun & Profil',
      items: [
        'Cara mengubah password',
        'Lupa password',
        'Verifikasi akun',
        'Hapus akun'
      ]
    },
    {
      title: 'Transaksi',
      items: [
        'Cara melakukan pembayaran',
        'Transaksi gagal',
        'Refund dan pembatalan',
        'Riwayat transaksi'
      ]
    },
    {
      title: 'Saldo & Pembayaran',
      items: [
        'Cara top up saldo',
        'Metode pembayaran',
        'Saldo tidak bertambah',
        'Biaya admin'
      ]
    }
  ];

  const contactOptions = [
    {
      title: 'WhatsApp',
      description: 'Chat langsung dengan CS',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      action: 'Chat Sekarang'
    },
    {
      title: 'Email',
      description: 'support@ppobindonesia.com',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
      action: 'Kirim Email'
    },
    {
      title: 'Telepon',
      description: '0800-1234-5678',
      icon: Phone,
      color: 'bg-purple-100 text-purple-600',
      action: 'Hubungi CS'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4">
        <div className="flex items-center space-x-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Pusat Bantuan</h1>
        </div>
      </div>

      <div className="p-4 pt-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari bantuan atau FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contact Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Hubungi Kami</h3>
          <div className="space-y-3">
            {contactOptions.map((option, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${option.color}`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{option.title}</h4>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-indigo-600">{option.action}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">FAQ</h3>
          <div className="space-y-4">
            {faqCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-md">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center justify-between"
                      >
                        <span>{item}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Help */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Bantuan Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>Jam Operasional CS:</strong><br />
                Senin - Jumat: 08:00 - 17:00 WIB<br />
                Sabtu - Minggu: 09:00 - 15:00 WIB
              </p>
              <p className="text-sm text-gray-600">
                <strong>Respon Time:</strong><br />
                WhatsApp: 1-5 menit<br />
                Email: 1-24 jam
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
