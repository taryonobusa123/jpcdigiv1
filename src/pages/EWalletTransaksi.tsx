
import React, { useState } from "react";
import { Wallet, History } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import EwalletBrandGrid from "@/components/EwalletBrandGrid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ChooseEwalletModal from "@/components/ChooseEwalletModal";
import { EWALLET_BRAND_LOGOS } from "@/components/ewallet-brand-logos";

// Dummy data (should come from backend profile/config in future)
const DEMO_USER_EWALLETS = [
  { name: "ShopeePay", logo: EWALLET_BRAND_LOGOS["shopeepay"], masked: "J*************", balance: 0, gratis: true }
];
const DEMO_EWALLET_LIST = [
  { name: "ShopeePay", logo: EWALLET_BRAND_LOGOS["shopeepay"], gratis: true },
  { name: "GoPay", logo: EWALLET_BRAND_LOGOS["gopay"] },
  { name: "OVO", logo: EWALLET_BRAND_LOGOS["ovo"] },
  { name: "Dana", logo: EWALLET_BRAND_LOGOS["dana"], gratis: true },
  { name: "LinkAja", logo: EWALLET_BRAND_LOGOS["linkaja"] },
  { name: "i.Saku", logo: EWALLET_BRAND_LOGOS["isaku"] }
];

const groupByBrand = (products: any[]) => {
  const brandGroups: { [brand: string]: any[] } = {};
  products.forEach((product) => {
    const brand = (product.brand || "Lainnya").toString();
    if (!brandGroups[brand]) {
      brandGroups[brand] = [];
    }
    brandGroups[brand].push(product);
  });
  return brandGroups;
};

const EWalletTransaksi = () => {
  const { data: products, isLoading, isError } = useProducts();
  const [chooseModalOpen, setChooseModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  const ewalletProducts =
    products?.filter(
      (item) =>
        (item.category?.toLowerCase() === "emoney" ||
          item.category?.toLowerCase() === "e-money") &&
        item.is_active
    ) || [];
  const brandGroups = groupByBrand(ewalletProducts);

  // Fitur: ketika pilih ewallet brand dari modal, buka grid produk brand
  function handleSelectBrand(brand: any) {
    if (brand.name && brandGroups[brand.name]) {
      setSelectedBrand(brand.name);
    } else {
      setSelectedBrand(null);
    }
    setChooseModalOpen(false);
  }

  // Dummy saldo, replace dengan data asli bila ada
  const saldo = 215000;
  const noRek = "8501 1423 2268 0010";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-[#fff5ed] pb-24 md:pb-10">
      <div className="max-w-lg mx-auto px-3 py-7 md:px-0">
        {/* Header + Button */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div className="flex gap-2 items-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200 text-lg text-orange-600">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">Saldo E-Wallet</div>
              <div className="text-xs text-gray-500">
                No. Rekening: <span className="tracking-wider">{noRek}</span>
              </div>
            </div>
          </div>
          <button
            className="bg-orange-500 text-white rounded-full px-6 py-2 font-semibold shadow hover:bg-orange-600 transition"
            onClick={() => setChooseModalOpen(true)}
          >
            + Pilih E-Wallet
          </button>
        </div>
        {/* Saldo Card */}
        <Card className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl shadow-lg mb-7">
          <CardHeader className="pb-0 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-white text-base font-medium flex items-center gap-2">Tabungan</CardTitle>
              <CardDescription className="text-orange-100">Saldo e-wallet anda saat ini</CardDescription>
            </div>
            <button className="flex items-center gap-1 bg-white/90 border border-orange-200 text-[13px] px-3 py-1 font-semibold text-orange-600 rounded-full shadow hover:bg-orange-50 transition">
              <History className="w-4 h-4 mr-1 -ml-1" /> Riwayat
            </button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end gap-2">
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow">Rp{saldo.toLocaleString("id-ID")}</span>
              <span className="bg-white/20 text-orange-50 px-2 py-0.5 rounded-full text-xs font-semibold">Up to date</span>
            </div>
            <div className="flex gap-7 text-xs mt-4 text-orange-100/90">
              <div>
                <span className="block font-semibold">Pendapatan Bunga</span>
                <span className="block font-bold text-white">Rp 0</span>
              </div>
              <div>
                <span className="block font-semibold">Suku Bunga</span>
                <span className="block font-bold text-white">2.3% p.a.</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Endpoint Info */}
        <div className="flex justify-between bg-white rounded-xl py-1.5 px-4 border border-orange-100 shadow-sm items-center mb-4">
          <span className="font-medium text-gray-600 text-[13px] flex items-center gap-1">
            <span>Transaksi digiflazz:</span>
          </span>
          <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 text-xs px-2">
            https://api.digiflazz.com/v1/transaction
          </Badge>
        </div>
        {/* E-wallet brand grid */}
        <Card className="rounded-2xl shadow-lg border bg-white p-0 mb-7 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-[17px] font-semibold text-orange-700 text-center">Pilih E-Wallet Favorit Anda</CardTitle>
            <CardDescription className="text-center">Semua layanan transaksi dompet digital didukung 24 jam & aman.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-orange-400 animate-pulse font-semibold">
                Memuat produk e-wallet...
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500 font-medium">
                Gagal memuat produk e-wallet.
              </div>
            ) : ewalletProducts.length === 0 ? (
              <div className="text-center text-muted-foreground text-base py-5">
                Tidak ada produk e-wallet tersedia.
              </div>
            ) : (
              <div>
                {/* Pilih ewallet satu brand jika dipilih via modal */}
                {selectedBrand && brandGroups[selectedBrand] ? (
                  <EwalletBrandGrid brandGroups={{ [selectedBrand]: brandGroups[selectedBrand] }} />
                ) : (
                  <EwalletBrandGrid brandGroups={brandGroups} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* FOOTER CATATAN */}
        <div className="text-xs text-gray-400 text-center mb-3">
          Powered by DigiFlazz. Layanan transaksi dompet digital dilengkapi keamanan tingkat lanjut.
        </div>
      </div>
      {/* Modal Pilih E-Wallet */}
      <ChooseEwalletModal
        open={chooseModalOpen}
        onOpenChange={setChooseModalOpen}
        ewalletList={DEMO_EWALLET_LIST}
        userEwallets={DEMO_USER_EWALLETS}
        onSelectBrand={handleSelectBrand}
      />
    </div>
  );
};

export default EWalletTransaksi;
