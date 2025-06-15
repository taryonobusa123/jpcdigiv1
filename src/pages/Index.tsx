
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import UserBalanceCard from "@/components/UserBalanceCard";
import QuickActions from "@/components/QuickActions";
import PromoSection from "@/components/PromoSection";
import BottomNavigation from "@/components/BottomNavigation";

// Tambahan: gambar hero dan deskripsi aplikasi
const heroImage =
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=600&q=80";

const Index = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <Header />
      {/* Hero section */}
      <div className="relative flex flex-col items-center text-center px-4 pt-6 mb-4 animate-fade-in">
        <img
          src={heroImage}
          alt="PPOB Indonesia hero"
          className="w-36 h-36 rounded-full object-cover shadow-lg mb-4 border-4 border-blue-200"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-2 drop-shadow">
          Selamat Datang di PPOB Indonesia
        </h1>
        <p className="text-base text-gray-600 mb-1">
          Semua kebutuhan pembayaran digital Anda, kini dalam satu genggaman.
        </p>
        <p className="text-xs text-indigo-400 italic">
          Hemat waktu dan nikmati promo menarik setiap hari!
        </p>
      </div>

      {/* Card Saldo & Quick Actions */}
      <div className="space-y-3 px-4">
        <div className="animate-fade-in">
          <UserBalanceCard />
        </div>
        <div className="animate-fade-in [animation-delay:0.1s]">
          <QuickActions />
        </div>
      </div>

      {/* Promo */}
      <div className="animate-fade-in [animation-delay:0.2s]">
        <PromoSection />
      </div>

      {/* Footer strip */}
      <div className="max-w-md mx-auto px-4 mb-20">
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-3 px-5 flex items-center justify-between shadow-lg">
          <span className="font-semibold text-sm">
            PPOB Indonesia &copy; {new Date().getFullYear()}
          </span>
          <span className="italic text-xs d-block hidden sm:inline">
            Aman • Terpercaya • Praktis
          </span>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;

