
import React from 'react';
import { HelpCircle, ArrowLeft, Shield, Award, Users, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Keamanan Terjamin',
      description: 'Transaksi aman dengan enkripsi tingkat bank'
    },
    {
      icon: Award,
      title: 'Terpercaya',
      description: 'Lebih dari 1 juta pengguna di seluruh Indonesia'
    },
    {
      icon: Users,
      title: 'Layanan 24/7',
      description: 'Customer service siap membantu kapan saja'
    },
    {
      icon: Smartphone,
      title: 'Mudah Digunakan',
      description: 'Interface sederhana dan user-friendly'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-4">
        <div className="flex items-center space-x-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Tentang Aplikasi</h1>
        </div>
      </div>

      <div className="p-4 pt-8">
        {/* App Info */}
        <Card className="mb-6 text-center">
          <CardContent className="p-6">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-2xl">P</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">PPOB Indonesia</h2>
            <p className="text-gray-600 mb-4">
              Platform pembayaran online terlengkap dan terpercaya untuk semua kebutuhan digital Anda
            </p>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <strong>Versi:</strong> 2.1.0<br />
                <strong>Build:</strong> 2024.06.15<br />
                <strong>Platform:</strong> Web App
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Mengapa Pilih Kami?</h3>
          <div className="grid grid-cols-1 gap-3">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Layanan Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>• Pulsa & Paket Data</div>
              <div>• Token PLN</div>
              <div>• Tagihan PLN</div>
              <div>• PDAM</div>
              <div>• BPJS Kesehatan</div>
              <div>• Internet & TV Kabel</div>
              <div>• E-Wallet</div>
              <div>• Voucher Game</div>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Perusahaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>PT PPOB Indonesia</strong></p>
              <p>Jl. Sudirman No. 123, Jakarta Pusat</p>
              <p>Jakarta 10220, Indonesia</p>
              <p>Email: info@ppobindonesia.com</p>
              <p>Telepon: (021) 1234-5678</p>
            </div>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <Button variant="ghost" size="sm" className="text-blue-600">
                Syarat & Ketentuan
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600">
                Kebijakan Privasi
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                © 2024 PPOB Indonesia. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
