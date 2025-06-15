
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import UserBalanceCard from '@/components/UserBalanceCard';
import QuickActions from '@/components/QuickActions';
import PromoSection from '@/components/PromoSection';
import BottomNavigation from '@/components/BottomNavigation';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page load time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Memuat halaman utama..." />;
  }

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
