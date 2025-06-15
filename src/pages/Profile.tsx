
import React from 'react';
import { 
  User, Settings, Bell, Shield, HelpCircle, LogOut, 
  ChevronRight, Camera, Star, Gift, CreditCard, Phone, UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user, profile, signOut } = useAuth();

  const menuItems = [
    {
      icon: User,
      label: 'Edit Profil',
      description: 'Ubah informasi pribadi',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: CreditCard,
      label: 'Metode Pembayaran',
      description: 'Kelola kartu & rekening',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Bell,
      label: 'Notifikasi',
      description: 'Atur preferensi notifikasi',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Shield,
      label: 'Keamanan',
      description: 'PIN, password & biometrik',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Gift,
      label: 'Reward & Poin',
      description: 'Tukar poin dengan hadiah',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Phone,
      label: 'Pusat Bantuan',
      description: 'FAQ & hubungi CS',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: HelpCircle,
      label: 'Tentang Aplikasi',
      description: 'Versi & informasi aplikasi',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Profil</h1>
          <button className="p-2 bg-white/20 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold">{profile?.full_name || 'User'}</h3>
              {profile?.whatsapp_number && (
                <p className="text-blue-100 text-sm">{profile.whatsapp_number}</p>
              )}
              <p className="text-blue-100 text-xs">{user.email}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Member Gold</span>
                </div>
                <div className="text-sm">
                  Poin: <span className="font-semibold">1,250</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6 relative z-10 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gray-800">245</h4>
              <p className="text-gray-500 text-xs">Transaksi</p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <h4 className="text-2xl font-bold text-gray-800">12</h4>
              <p className="text-gray-500 text-xs">Bulan Aktif</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gray-800">4.8</h4>
              <p className="text-gray-500 text-xs">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors active:scale-95"
          >
            <div className={`p-2.5 rounded-lg ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-gray-800 text-sm">{item.label}</h4>
              <p className="text-gray-500 text-xs">{item.description}</p>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}

        {/* Logout Button */}
        <button 
          onClick={handleSignOut}
          className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3 hover:bg-red-50 transition-colors active:scale-95 border border-red-100"
        >
          <div className="p-2.5 rounded-lg bg-red-100">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-red-600 text-sm">Keluar</h4>
            <p className="text-red-400 text-xs">Keluar dari akun Anda</p>
          </div>
          
          <ChevronRight className="w-5 h-5 text-red-400" />
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
