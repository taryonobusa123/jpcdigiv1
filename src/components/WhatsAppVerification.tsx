
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WhatsAppVerificationProps {
  whatsappNumber: string;
  onVerificationComplete: () => void;
}

export default function WhatsAppVerification({ whatsappNumber, onVerificationComplete }: WhatsAppVerificationProps) {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { whatsapp_number: whatsappNumber }
      });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Kode OTP telah dikirim ke WhatsApp Anda",
      });
      
      startCountdown();
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengirim kode OTP",
        variant: "destructive",
      });
    }
    setIsSending(false);
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Error",
        description: "Kode OTP harus 6 digit",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
        body: { 
          whatsapp_number: whatsappNumber, 
          otp_code: otpCode,
          user_id: user?.id 
        }
      });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Verifikasi WhatsApp berhasil!",
      });
      
      onVerificationComplete();
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Error",
        description: error.message || "Kode OTP tidak valid",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle>Verifikasi WhatsApp</CardTitle>
        <CardDescription>
          Kami akan mengirim kode verifikasi ke nomor WhatsApp Anda
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-green-500" />
          <span className="font-medium">{whatsappNumber}</span>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleSendOTP}
            disabled={isSending || countdown > 0}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            {isSending ? 'Mengirim...' : countdown > 0 ? `Kirim Ulang (${countdown}s)` : 'Kirim Kode OTP'}
          </Button>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Masukkan Kode OTP (6 digit)
            </label>
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
            >
              <InputOTPGroup className="w-full flex justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleVerifyOTP}
            disabled={isLoading || otpCode.length !== 6}
            className="w-full"
          >
            {isLoading ? 'Memverifikasi...' : 'Verifikasi Kode'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Kode OTP berlaku selama 5 menit. Pastikan WhatsApp Anda aktif untuk menerima pesan.
        </div>
      </CardContent>
    </Card>
  );
}
