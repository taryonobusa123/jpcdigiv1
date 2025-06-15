
import React from 'react';
import { CreditCard, Building2, Smartphone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
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
  );
};

export default PaymentMethodSelector;
