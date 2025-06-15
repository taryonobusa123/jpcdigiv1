import React from 'react';
import {
  ArrowLeft,
  Home,
  Truck,
  Package,
  CalendarDays,
  MapPin,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import ServiceCategory from '@/components/ServiceCategory';
import ArangOrderForm from '@/components/ArangOrderForm';
import ArangOrdersList from '@/components/ArangOrdersList';

const Delivery = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-amber-700 to-amber-400 text-white p-4 mb-4 rounded-b-xl shadow">
        <h1 className="text-xl font-bold">Layanan Pesan Arang Kayu</h1>
        <p className="text-sm mt-1">Pesan arang kayu asli untuk kebutuhan rumah, bisnis, maupun cafe. Pengiriman di wilayah Anda.</p>
      </div>
      <ArangOrderForm />
      <ArangOrdersList />
      <BottomNavigation />
    </div>
  );
};

export default Delivery;
