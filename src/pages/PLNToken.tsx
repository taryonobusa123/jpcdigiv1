
import React, { useState } from 'react';
import { ArrowLeft, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePlnMeterCheck } from '@/hooks/usePlnMeterCheck';
import { usePlnPurchase } from '@/hooks/usePlnPurchase';
import BottomNavigation from '@/components/BottomNavigation';

const PLNToken = () => {
  const [meterNumber, setMeterNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customerData, setCustomerData] = useState<any>(null);
  const [step, setStep] = useState<'input' | 'check' | 'purchase'>('input');

  const { toast } = useToast();
  const meterCheck = usePlnMeterCheck();
  const plnPurchase = usePlnPurchase();

  const amounts = [
    { value: '20000', label: 'Rp 20.000', admin: 2500 },
    { value: '50000', label: 'Rp 50.000', admin: 2500 },
    { value: '100000', label: 'Rp 100.000', admin: 2500 },
    { value: '200000', label: 'Rp 200.000', admin: 2500 },
    { value: '500000', label: 'Rp 500.000', admin: 2500 },
    { value: '1000000', label: 'Rp 1.000.000', admin: 2500 },
  ];

  const handleCheckMeter = async () => {
    if (!meterNumber) {
      toast({
        title: "Error",
        description: "Masukkan nomor meter terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await meterCheck.mutateAsync(meterNumber);
      if (result.success) {
        setCustomerData(result.data);
        setStep('check');
      }
    } catch (error) {
      console.error('Meter check error:', error);
    }
  };

  const handlePurchase = async () => {
    if (!selectedAmount || !customerData) {
      toast({
        title: "Error",
        description: "Pilih nominal terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const selectedAmountData = amounts.find(a => a.value === selectedAmount);
    if (!selectedAmountData) return;

    try {
      await plnPurchase.mutateAsync({
        customer_id: meterNumber,
        amount: parseInt(selectedAmount),
        admin_fee: selectedAmountData.admin,
        customer_name: customerData.customer_name,
      });
      setStep('purchase');
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const totalAmount = selectedAmount ? 
    parseInt(selectedAmount) + (amounts.find(a => a.value === selectedAmount)?.admin || 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">PLN Token Listrik</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Step 1: Input Meter Number */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Nomor Meter / ID Pelanggan</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="meter">Nomor Meter</Label>
              <Input
                id="meter"
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="Masukkan nomor meter PLN"
                disabled={step !== 'input'}
              />
            </div>
            
            {step === 'input' && (
              <Button 
                onClick={handleCheckMeter} 
                disabled={meterCheck.isPending}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                {meterCheck.isPending ? 'Mengecek...' : 'Cek Nomor Meter'}
              </Button>
            )}
          </div>
        </div>

        {/* Step 2: Customer Data & Amount Selection */}
        {step === 'check' && customerData && (
          <>
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Data Pelanggan</span>
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-medium">{customerData.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Pelanggan:</span>
                  <span className="font-medium">{meterNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarif/Daya:</span>
                  <span className="font-medium">{customerData.tarif || 'R1/900VA'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Nominal Token</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {amounts.map((amount) => (
                  <button
                    key={amount.value}
                    onClick={() => setSelectedAmount(amount.value)}
                    className={`p-4 rounded-lg border-2 text-center font-semibold transition-colors ${
                      selectedAmount === amount.value
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    {amount.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedAmount && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pembelian</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token Listrik</span>
                    <span className="font-medium">
                      Rp {parseInt(selectedAmount).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span className="font-medium">
                      Rp {amounts.find(a => a.value === selectedAmount)?.admin.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Bayar</span>
                    <span className="text-yellow-600">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePurchase}
                  disabled={plnPurchase.isPending}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 mt-4"
                >
                  {plnPurchase.isPending ? 'Memproses...' : 'Beli Token'}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Step 3: Purchase Success */}
        {step === 'purchase' && (
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pembelian Token Berhasil!
            </h3>
            <p className="text-gray-600 mb-4">
              Token listrik akan segera dikirim ke nomor meter Anda
            </p>
            <Button 
              onClick={() => {
                setStep('input');
                setMeterNumber('');
                setSelectedAmount('');
                setCustomerData(null);
              }}
              variant="outline"
              className="w-full"
            >
              Beli Token Lagi
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PLNToken;
