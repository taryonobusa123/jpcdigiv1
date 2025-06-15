
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  path: string;
}

export default function ProfileMenuItem({ icon: Icon, label, description, color, path }: ProfileMenuItemProps) {
  return (
    <Link
      to={path}
      className="block w-full bg-white rounded-xl shadow-sm p-4 hover:bg-gray-50 transition-colors active:scale-95"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 text-left">
          <h4 className="font-semibold text-gray-800 text-sm">{label}</h4>
          <p className="text-gray-500 text-xs">{description}</p>
        </div>
        
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}
