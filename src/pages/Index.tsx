
import React from "react";
import {
  Bell,
  Eye,
  ArrowRight,
  Send,
  Wallet,
  Users,
  PiggyBank,
  Download,
  BadgePercent,
  MoreHorizontal,
  QrCode,
  Home,
  User,
  ArrowRightLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const user = {
  name: "Yoga Prasetya",
  noRek: "9019 5873 0549",
  photoUrl: "/placeholder.svg", // Gunakan asset/avatar lokal atau dummy
  saldo: 479700,
  bunga: 76598,
  sukuBunga: "3%",
  notifikasi: 55,
  limitPinjam: 7500000
};

const actionMenus = [
  {
    label: "Transfer",
    icon: Send,
    isNew: true
  },
  {
    label: "Top Up & Tagihan",
    icon: ArrowRightLeft,
    isNew: true
  },
  {
    label: "Top Up E-Wallet",
    icon: Wallet
  },
  {
    label: "Undang Teman",
    icon: Users
  },
  {
    label: "Deposito",
    icon: PiggyBank
  },
  {
    label: "Tarik Tunai",
    icon: Download
  },
  {
    label: "SeaBank Pinjam",
    icon: BadgePercent,
    isNew: true
  },
  {
    label: "Lihat Semua",
    icon: MoreHorizontal
  }
];

const flashDeals = [
  {
    periode: "12 bulan",
    rate: "7,?%",
    oldRate: "6,00%",
    kuota: 100
  },
  {
    periode: "6 bulan",
    rate: "6,?%",
    oldRate: "5,75%",
    kuota: 400
  },
  {
    periode: "3 bulan",
    rate: "5,?%",
    oldRate: "5,25%",
    kuota: 600
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] pb-20">
      {/* Top Bar */}
      <div className="bg-white px-5 pt-5 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl tracking-wide">17.33</div>
          <div className="flex items-center gap-4">
            <span className="relative">
              <Bell className="w-7 h-7 text-gray-500" />
              <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white font-bold text-[11px] rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white">
                {user.notifikasi}
              </span>
            </span>
          </div>
        </div>
        {/* Profile */}
        <div className="flex items-center gap-3 select-none">
          <img
            src={user.photoUrl}
            alt="profile"
            className="rounded-full w-11 h-11 object-cover border-2 border-orange-200 bg-orange-50"
          />
          <div>
            <span className="block font-bold text-lg text-gray-800">{user.name}</span>
            <span className="block text-sm text-gray-500 leading-tight flex items-center gap-1">
              No. Rekening: <span className="ml-1 tracking-wider">{user.noRek}</span>
              <button className="ml-1 px-1 hover:bg-gray-100 rounded text-xs text-orange-500 font-medium transition">📋</button>
            </span>
          </div>
        </div>
      </div>
      {/* Saldo Card */}
      <div className="px-4 mt-1">
        <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-5 shadow relative">
          <div className="flex justify-between items-center">
            <span className="text-base text-white/95 font-semibold flex items-center gap-2">
              Tabungan
              <Eye className="inline w-4 h-4 text-white/70" />
            </span>
            <button className="bg-white/90 rounded-full py-0.5 px-3 text-orange-600 text-xs font-bold flex items-center gap-1 shadow hover:bg-orange-50 transition">
              Riwayat <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="py-1 pl-0.5 mb-2 pt-3">
            <span className="text-4xl md:text-5xl font-extrabold tracking-wider text-white drop-shadow">
              Rp{user.saldo.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-start gap-8 mt-2">
            <div>
              <span className="text-white/85 text-xs flex items-center gap-1">
                Pendapatan Bunga <span className="ml-1 text-[11px]">ⓘ</span>
              </span>
              <div className="font-bold text-white text-lg">
                Rp {user.bunga.toLocaleString("id-ID")}
              </div>
            </div>
            <div>
              <span className="text-white/85 text-xs flex items-center gap-1">
                Suku Bunga <span className="ml-1 text-[11px]">ⓘ</span>
              </span>
              <div className="font-bold text-white text-lg">
                {user.sukuBunga} <span className="text-xs font-normal">p.a.</span>
              </div>
            </div>
          </div>
          <span className="absolute right-7 top-5 text-[8rem] font-black text-orange-200/30 select-none pointer-events-none">S</span>
        </div>
      </div>
      {/* Action Grid */}
      <div className="px-4">
        <div className="bg-white mt-5 rounded-2xl shadow p-4">
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {actionMenus.map((menu, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="relative mb-1">
                  <div className="w-11 h-11 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 text-2xl shadow-sm">
                    <menu.icon className="w-6 h-6" />
                  </div>
                  {menu.isNew && (
                    <span className="absolute -top-1 -right-2 px-1.5 bg-orange-500 text-white text-[11px] font-bold rounded-full shadow">
                      Baru
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-800 font-medium leading-tight text-center">{menu.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Flash Deals */}
      <div className="px-4">
        <div className="bg-orange-50/80 mt-6 rounded-2xl shadow p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[15px] text-orange-700 flex items-center gap-1">
              <ArrowRight className="w-4 h-4 inline -ml-1" />
              Deposito Flash Deals
            </span>
            <span className="text-xs bg-orange-200 rounded-full px-2 py-0.5 text-orange-700 font-bold">Setiap Kamis</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {flashDeals.map((deal, i) => (
              <div key={i} className="bg-white border border-orange-100 rounded-xl py-3 px-2 flex flex-col items-start">
                <span className="font-bold text-lg text-orange-600 flex items-end gap-1">
                  {deal.rate}
                  <span className="text-xs font-normal text-slate-500 ml-1">p.a.</span>
                </span>
                <span className="line-through text-xs text-gray-400">{deal.oldRate} p.a.</span>
                <span className="block text-xs text-orange-500 font-semibold mt-1">{deal.periode}</span>
                <span className="block text-xs text-gray-500 mt-1">{deal.kuota} kuota</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* SeaBank Pinjam */}
      <div className="px-4">
        <div className="bg-white mt-6 rounded-2xl shadow p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-[15px] text-gray-800">
              SeaBank Pinjam
            </span>
            <span className="text-xs bg-orange-200 rounded-full px-2 py-0.5 text-orange-700 font-bold">
              Bunga rendah mulai dari 2.00%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="block text-gray-500 text-xs">Limit Pinjaman</span>
            <button className="bg-orange-500 text-white text-sm rounded-lg px-5 py-1.5 font-semibold">
              Cairkan
            </button>
          </div>
          <span className="text-2xl font-bold text-orange-700">
            Rp {user.limitPinjam.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="fixed left-0 bottom-0 right-0 bg-white border-t border-gray-200 py-1.5 z-50 flex justify-around items-center shadow-md">
        <div className="flex flex-col items-center">
          <Home className="w-6 h-6 text-orange-500" />
          <span className="text-xs font-bold text-orange-500 mt-0.5">Beranda</span>
        </div>
        <div className="flex flex-col items-center">
          <ArrowRightLeft className="w-6 h-6 text-gray-400" />
          <span className="text-xs font-medium text-gray-400 mt-0.5">Bayar/Transfer</span>
        </div>
        <div className="-mt-6">
          <div className="bg-orange-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-4 border-white">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <span className="block text-xs font-bold text-orange-500 text-center mt-1">QRIS</span>
        </div>
        <div className="flex flex-col items-center">
          <PiggyBank className="w-6 h-6 text-gray-400" />
          <span className="text-xs font-medium text-gray-400 mt-0.5">Deposito</span>
        </div>
        <div className="flex flex-col items-center">
          <User className="w-6 h-6 text-gray-400" />
          <span className="text-xs font-medium text-gray-400 mt-0.5">Saya</span>
        </div>
      </div>
    </div>
  );
}
