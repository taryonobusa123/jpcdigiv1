
import { 
  User, Bell, Shield, HelpCircle, Gift, CreditCard, Phone
} from 'lucide-react';

export const profileMenuItems = [
  {
    icon: User,
    label: 'Edit Profil',
    description: 'Ubah informasi pribadi',
    color: 'bg-blue-100 text-blue-600',
    path: '/edit-profile'
  },
  {
    icon: CreditCard,
    label: 'Metode Pembayaran',
    description: 'Kelola kartu & rekening',
    color: 'bg-green-100 text-green-600',
    path: '/payment-methods'
  },
  {
    icon: Bell,
    label: 'Notifikasi',
    description: 'Atur preferensi notifikasi',
    color: 'bg-yellow-100 text-yellow-600',
    path: '/notifications'
  },
  {
    icon: Shield,
    label: 'Keamanan',
    description: 'PIN, password & biometrik',
    color: 'bg-red-100 text-red-600',
    path: '/security'
  },
  {
    icon: Gift,
    label: 'Reward & Poin',
    description: 'Tukar poin dengan hadiah',
    color: 'bg-purple-100 text-purple-600',
    path: '/rewards'
  },
  {
    icon: Phone,
    label: 'Pusat Bantuan',
    description: 'FAQ & hubungi CS',
    color: 'bg-indigo-100 text-indigo-600',
    path: '/help-center'
  },
  {
    icon: HelpCircle,
    label: 'Tentang Aplikasi',
    description: 'Versi & informasi aplikasi',
    color: 'bg-gray-100 text-gray-600',
    path: '/about'
  }
];
