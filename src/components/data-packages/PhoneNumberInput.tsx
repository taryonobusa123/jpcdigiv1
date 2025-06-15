import React, { useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneNumberInputProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onOperatorDetected: (operator: string) => void;
}

// Helper untuk mengubah ke Title Case
function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const BRAND_MAPPING: Record<string, string> = {
  'telkomsel': 'telkomsel',
  'indosat': 'indosat',
  'xl': 'xl',
  'axis': 'axis',
  'tri': 'tri',
  'smartfren': 'smartfren'
};

const PhoneNumberInput = ({ phoneNumber, setPhoneNumber, onOperatorDetected }: PhoneNumberInputProps) => {
  const [detectedOperator, setDetectedOperator] = React.useState('');

  useEffect(() => {
    if (phoneNumber.length >= 4) {
      const prefix = phoneNumber.substring(0, 4);

      let operator = '';
      if (['0811', '0812', '0813', '0821', '0822', '0851', '0852', '0853'].includes(prefix)) {
        operator = 'telkomsel';
      } else if (['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix)) {
        operator = 'indosat';
      } else if (['0817', '0818', '0819', '0859', '0877', '0878'].includes(prefix)) {
        operator = 'xl';
      } else if (['0838', '0831', '0832', '0833'].includes(prefix)) {
        operator = 'axis';
      } else if (['0895', '0896', '0897', '0898', '0899'].includes(prefix)) {
        operator = 'tri';
      } else if (['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888'].includes(prefix)) {
        operator = 'smartfren';
      }

      setDetectedOperator(operator);
      onOperatorDetected(operator); // operator (lowercase) untuk ke query
    } else {
      setDetectedOperator('');
      onOperatorDetected('');
    }
  }, [phoneNumber, onOperatorDetected]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <Label htmlFor="phone" className="text-base font-semibold text-gray-800 mb-2 block">
        Nomor Telepon
      </Label>
      <div className="relative">
        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="0812xxxxxxxx"
          className="pl-10"
        />
        {detectedOperator && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
              {/* Tampilkan operator dengan huruf besar di awal */}
              {toTitleCase(detectedOperator)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
