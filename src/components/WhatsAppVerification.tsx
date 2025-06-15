
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
  onWhatsAppSubmit?: (number: string) => void;
}

export default function WhatsAppVerification({ 
  whatsappNumber: initialWhatsappNumber, 
  onVerificationComplete,
  onWhatsAppSubmit 
}: WhatsAppVerificationProps) {
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState(initialWhatsappNumber ? 'otp' : 'phone');
  const { toast } = useToast();
  const { user } = useAuth();

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

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber.trim()) {
      toast({
        title: "Error",
        description: "Nomor WhatsApp tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    const formatted = formatWhatsAppNumber(whatsappNumber);
    setWhatsappNumber(formatted);
    setStep('otp');
    
    if (onWhatsAppSubmit) {
      onWhatsAppSubmit(formatted);
    }
    
    // Automatically send OTP when moving to OTP step
    handleSendOTP(formatted);
  };

  const handleSendOTP = async (numberToUse?: string) => {
    const targetNumber = numberToUse || whatsappNumber;
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { whatsapp_number: targetNumber }
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

  if (step === 'phone') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Verifikasi WhatsApp</CardTitle>
          <CardDescription>
            Masukkan nomor WhatsApp Anda untuk verifikasi akun
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nomor WhatsApp
              </label>
              <Input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
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
            >
              Lanjutkan Verifikasi
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle>Verifikasi WhatsApp</CardTitle>
        <CardDescription>
          Kami telah mengirim kode verifikasi ke nomor WhatsApp Anda
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-green-500" />
          <span className="font-medium">{whatsappNumber}</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setStep('phone')}
            className="text-blue-500 hover:text-blue-600 ml-auto"
          >
            Ubah
          </Button>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => handleSendOTP()}
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
