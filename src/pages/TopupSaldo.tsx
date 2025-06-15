
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateTopupRequest } from '@/hooks/useTopup';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import TopupHeader from '../components/topup/TopupHeader';
import AmountSelector from '../components/topup/AmountSelector';
import PaymentMethodSelector from '../components/topup/PaymentMethodSelector';
import ProofUpload from '../components/topup/ProofUpload';
import TopupInfo from '../components/topup/TopupInfo';
import LoginPrompt from '../components/topup/LoginPrompt';

const TopupSaldo = () => {
  const { user, profile } = useAuth();
  const createTopupRequest = useCreateTopupRequest();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [refCode, setRefCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseInt(amount) < 10000) {
      return;
    }

    try {
      await createTopupRequest.mutateAsync({
        amount: parseInt(amount),
        payment_method: paymentMethod,
        proof_image: refCode,
      });
      
      // Reset form
      setAmount('');
      setPaymentMethod('bank_transfer');
      setRefCode('');
    } catch (error) {
      console.error('Top up request error:', error);
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return <LoginPrompt />;
  }

  // Show loading overlay when processing
  if (createTopupRequest.isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium text-gray-800">Memproses permintaan...</p>
          <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopupHeader balance={profile?.balance || 0} />

      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AmountSelector amount={amount} onAmountChange={setAmount} />
          
          <PaymentMethodSelector 
            paymentMethod={paymentMethod} 
            onPaymentMethodChange={setPaymentMethod} 
          />
          
          <ProofUpload 
            proofImage={refCode} 
            onProofImageChange={setRefCode} 
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!amount || parseInt(amount) < 10000}
          >
            Kirim Permintaan Top Up
          </Button>
        </form>

        <TopupInfo />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TopupSaldo;
