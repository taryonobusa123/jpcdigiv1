
import React from 'react';
import { Smartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneNumberInputProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const PhoneNumberInput = ({ phoneNumber, setPhoneNumber }: PhoneNumberInputProps) => {
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
      </div>
    </div>
  );
};

export default PhoneNumberInput;
