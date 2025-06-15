
import React from 'react';
import { User, Camera, Settings, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  user: any;
  profile: any;
}

export default function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  return (
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
  );
}
