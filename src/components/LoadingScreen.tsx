
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

const LoadingScreen = ({ 
  message = "Memuat...", 
  submessage = "Mohon tunggu sebentar" 
}: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-lg font-medium text-gray-800">{message}</p>
        <p className="text-sm text-gray-500 mt-2">{submessage}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
