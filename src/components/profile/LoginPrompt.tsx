
import React from 'react';
import { User, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNavigation from '../BottomNavigation';

export default function LoginPrompt() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Profil</h1>
        </div>
      </div>

      {/* Login Prompt */}
      <div className="p-4 pt-8">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Login</h3>
          <p className="text-gray-600 mb-6">
            Silakan login untuk mengakses profil dan fitur lainnya
          </p>
          <Link to="/login">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Masuk / Daftar
            </Button>
          </Link>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
