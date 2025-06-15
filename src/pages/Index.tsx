
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import UserBalanceCard from '@/components/UserBalanceCard';
import QuickActions from '@/components/QuickActions';
import PromoSection from '@/components/PromoSection';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  // Anda masih bisa menggunakan useAuth jika memang data user dibutuhkan
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <UserBalanceCard />
      <QuickActions />
      <PromoSection />
      <BottomNavigation />
    </div>
  );
};

export default Index;
