
import React, { useState } from 'react';
import { ArrowLeft, Wallet, CreditCard, Building2, Smartphone, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCreateTopupRequest } from '@/hooks/useTopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BottomNavigation from '../components/BottomNavigation';

const TopupSaldo = () => {
  const { user, profile } = useAuth();
  const createTopupRequest = useCreateTopupRequest();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [proofImage, setProofImage] = useState('');

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      icon: Building2,
      description: 'BCA, Mandiri, BRI, BNI',
      details: 'Transfer ke rekening yang akan diberikan'
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'GoPay, OVO, DANA',
      details: 'Transfer via aplikasi e-wallet'
    },
    {
      id: 'virtual_account',
      name: 'Virtual Account',
      icon: CreditCard,
      description: 'VA Bank',
      details: 'Bayar melalui virtual account'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseInt(amount) < 10000) {
      return;
    }

    try {
      await createTopupRequest.mutateAsync({
        amount: parseInt(amount),
        payment_method: paymentMethod,
        proof_image: proofImage,
      });
      
      // Reset form
      setAmount('');
      setPaymentMethod('bank_transfer');
      setProofImage('');
    } catch (error) {
      console.error('Top up request error:', error);
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Diperlukan</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">Silakan login untuk melakukan top up saldo</p>
            <Link to="/login">
              <Button className="w-full">Login Sekarang</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Top Up Saldo</h1>
          </div>
          <Link to="/topup-history" className="p-2 hover:bg-white/20 rounded-lg">
            <History className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Current Balance */}
        <Card className="bg-white/10 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6" />
              <div>
                <p className="text-blue-100 text-sm">Saldo Saat Ini</p>
                <p className="text-xl font-bold">{formatCurrency(profile?.balance || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pilih Nominal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Predefined amounts */}
              <div className="grid grid-cols-2 gap-3">
                {predefinedAmounts.map((preAmount) => (
                  <button
                    key={preAmount}
                    type="button"
                    onClick={() => setAmount(preAmount.toString())}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      amount === preAmount.toString()
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {formatCurrency(preAmount)}
                  </button>
                ))}
              </div>
              
              {/* Custom amount */}
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Atau masukkan nominal lain</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Minimal Rp 10.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10000"
                />
                <p className="text-sm text-gray-500">Minimal top up Rp 10.000</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <method.icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                          <p className="text-xs text-gray-400">{method.details}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Proof Upload (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bukti Transfer (Opsional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="proof-image">Link gambar bukti transfer</Label>
                <Input
                  id="proof-image"
                  type="url"
                  placeholder="https://example.com/bukti-transfer.jpg"
                  value={proofImage}
                  onChange={(e) => setProofImage(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Upload bukti transfer ke layanan hosting gambar dan masukkan linknya di sini
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!amount || parseInt(amount) < 10000 || createTopupRequest.isPending}
          >
            {createTopupRequest.isPending ? 'Memproses...' : 'Kirim Permintaan Top Up'}
          </Button>
        </form>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Nominal transfer akan ditambah angka random untuk identifikasi</li>
              <li>• Saldo akan masuk setelah admin mengkonfirmasi pembayaran</li>
              <li>• Proses konfirmasi biasanya 1-24 jam pada hari kerja</li>
              <li>• Pastikan nominal transfer sesuai dengan yang diminta</li>
              <li>• Simpan bukti transfer untuk keperluan konfirmasi</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TopupSaldo;
