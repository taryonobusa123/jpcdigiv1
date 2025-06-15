
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatWhatsAppNumber = (number: string) => {
    // Remove all non-digits
    const cleaned = number.replace(/\D/g, '');
    
    // Add +62 prefix if it starts with 0
    if (cleaned.startsWith('0')) {
      return '+62' + cleaned.substring(1);
    }
    
    // Add +62 prefix if it doesn't start with 62
    if (!cleaned.startsWith('62')) {
      return '+62' + cleaned;
    }
    
    return '+' + cleaned;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsappNumber.trim()) {
      toast({
        title: "Error",
        description: "Nomor WhatsApp harus diisi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedWhatsapp = formatWhatsAppNumber(whatsappNumber);
      
      // Redirect to WhatsApp verification page
      navigate(`/verify-whatsapp?number=${encodeURIComponent(formattedWhatsapp)}`);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleWhatsAppChange = (value: string) => {
    // Only allow numbers, +, and common formatting characters
    const cleaned = value.replace(/[^\d+\-\s()]/g, '');
    setWhatsappNumber(cleaned);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Masuk dengan WhatsApp</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Masuk dengan WhatsApp
            </CardTitle>
            <CardDescription>
              Masukkan nomor WhatsApp Anda untuk menerima kode verifikasi
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Nomor WhatsApp</span>
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => handleWhatsAppChange(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  required
                />
                <p className="text-xs text-gray-500">
                  Contoh: 0812345678 atau +6281234567890
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600" 
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Kirim Kode Verifikasi'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Dengan melanjutkan, Anda akan menerima kode verifikasi melalui WhatsApp
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
