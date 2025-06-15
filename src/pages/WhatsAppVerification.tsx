
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhatsAppVerification from '@/components/WhatsAppVerification';
import { useAuth } from '@/hooks/useAuth';

const WhatsAppVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const urlWhatsappNumber = searchParams.get('number') || '';

  useEffect(() => {
    // If no WhatsApp number in URL and no user, redirect to login
    if (!urlWhatsappNumber && !user) {
      navigate('/login');
      return;
    }
    
    // If WhatsApp number is in URL, use it
    if (urlWhatsappNumber) {
      setWhatsappNumber(urlWhatsappNumber);
    }
    // If user exists but no WhatsApp number in URL, let them enter it
  }, [urlWhatsappNumber, user, navigate]);

  const handleVerificationComplete = async () => {
    setIsVerified(true);
    await refreshProfile();
    
    // Redirect to home after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleWhatsAppSubmit = (number: string) => {
    setWhatsappNumber(number);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Verifikasi Berhasil!</h2>
          <p className="text-gray-600">WhatsApp Anda telah berhasil diverifikasi</p>
          <p className="text-sm text-gray-500">Mengalihkan ke halaman utama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Link to="/login" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Verifikasi WhatsApp</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <WhatsAppVerification
          whatsappNumber={whatsappNumber}
          onVerificationComplete={handleVerificationComplete}
          onWhatsAppSubmit={handleWhatsAppSubmit}
        />
      </div>
    </div>
  );
};

export default WhatsAppVerificationPage;
