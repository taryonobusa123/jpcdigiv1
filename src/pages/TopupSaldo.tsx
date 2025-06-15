
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCreateTopupRequest } from '@/hooks/useTopup';
import { Button } from '@/components/ui/button';
import BottomNavigation from '../components/BottomNavigation';
import TopupHeader from '../components/topup/TopupHeader';
import AmountSelector from '../components/topup/AmountSelector';
import PaymentMethodSelector from '../components/topup/PaymentMethodSelector';
import ProofUpload from '../components/topup/ProofUpload';
import TopupInfo from '../components/topup/TopupInfo';
import LoginPrompt from '../components/topup/LoginPrompt';
import LoadingScreen from '../components/LoadingScreen';

const TopupSaldo = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
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
      const result = await createTopupRequest.mutateAsync({
        amount: parseInt(amount),
        payment_method: paymentMethod,
        proof_image: refCode,
      });
      
      // Navigate to detail page with the topup request ID
      navigate(`/topup-detail/${result.id}`);
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
    return <LoadingScreen message="Memproses permintaan..." />;
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
