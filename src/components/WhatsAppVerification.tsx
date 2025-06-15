
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, Shield, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [hasError, setHasError] = useState(false);
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
    setHasError(false);
    
    try {
      console.log('Attempting to send OTP to:', targetNumber);
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { whatsapp_number: targetNumber }
      });

      console.log('OTP response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Gagal mengirim OTP');
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      toast({
        title: "Berhasil",
        description: "Kode OTP telah dikirim ke WhatsApp Anda",
      });
      
      startCountdown();
      setHasError(false);
    } catch (error: any) {
      console.error('Send OTP error:', error);
      setHasError(true);
      
      let errorMessage = "Gagal mengirim kode OTP";
      
      if (error.message?.includes('Request Failed')) {
        errorMessage = "Layanan WhatsApp sedang tidak tersedia. Silakan coba lagi dalam beberapa menit.";
      } else if (error.message?.includes('non-2xx status')) {
        errorMessage = "Terjadi masalah teknis. Silakan coba lagi atau hubungi admin.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
      console.log('Attempting to verify OTP:', otpCode, 'for number:', whatsappNumber);
      
      const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
        body: { 
          whatsapp_number: whatsappNumber, 
          otp_code: otpCode,
          user_id: user?.id 
        }
      });

      console.log('Verify response:', { data, error });

      if (error) {
        console.error('Verify function error:', error);
        throw new Error('Terjadi kesalahan saat memverifikasi OTP');
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      if (data?.success) {
        toast({
          title: "Berhasil",
          description: "Verifikasi WhatsApp berhasil!",
        });
        
        onVerificationComplete();
      } else {
        throw new Error('Kode OTP tidak valid');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      let errorMessage = "Kode OTP tidak valid atau sudah kadaluarsa";
      if (error.message && !error.message.includes('non-2xx')) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSkipVerification = () => {
    toast({
      title: "Verifikasi Dilewati",
      description: "Anda dapat melakukan verifikasi WhatsApp nanti di halaman profil",
    });
    onVerificationComplete();
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
            
            <div className="space-y-2">
              <Button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Lanjutkan Verifikasi
              </Button>
              
              <Button 
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleSkipVerification}
              >
                Lewati Verifikasi (Nanti)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {hasError ? (
            <AlertCircle className="w-8 h-8 text-red-600" />
          ) : (
            <Shield className="w-8 h-8 text-green-600" />
          )}
        </div>
        <CardTitle>Verifikasi WhatsApp</CardTitle>
        <CardDescription>
          {hasError 
            ? "Terjadi masalah saat mengirim kode verifikasi"
            : "Kami akan mengirim kode verifikasi ke nomor WhatsApp Anda"
          }
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

        {hasError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Gagal Mengirim OTP</p>
                <p className="text-sm text-red-600 mt-1">
                  Layanan WhatsApp sedang bermasalah. Silakan coba lagi atau lewati verifikasi untuk sementara.
                </p>
              </div>
            </div>
          </div>
        ) : null}

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

          <div className="space-y-2">
            <Button 
              onClick={handleVerifyOTP}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full"
            >
              {isLoading ? 'Memverifikasi...' : 'Verifikasi Kode'}
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleSkipVerification}
              className="w-full text-gray-600"
            >
              Lewati Verifikasi (Nanti)
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Kode OTP berlaku selama 5 menit. Pastikan WhatsApp Anda aktif untuk menerima pesan.
        </div>
      </CardContent>
    </Card>
  );
}
