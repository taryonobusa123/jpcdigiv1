
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, User } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    onOpenChange(false);
    navigate('/login');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Akses Akun Anda</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600">
              Silakan masuk atau daftar untuk menggunakan semua fitur aplikasi
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Login dengan WhatsApp</h4>
                <p className="text-sm text-gray-600">Gunakan nomor WhatsApp Anda</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Login dengan Email</h4>
                <p className="text-sm text-gray-600">Akses cepat dengan email</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleNavigateToLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
          >
            Lanjutkan ke Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
