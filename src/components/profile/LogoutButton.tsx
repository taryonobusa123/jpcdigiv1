
import React from 'react';
import { LogOut, ChevronRight } from 'lucide-react';

interface LogoutButtonProps {
  onSignOut: () => void;
}

export default function LogoutButton({ onSignOut }: LogoutButtonProps) {
  return (
    <button 
      onClick={onSignOut}
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
  );
}
