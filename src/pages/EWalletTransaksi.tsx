
import React, { useState } from "react";
import { Wallet, History } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import EwalletBrandGrid from "@/components/EwalletBrandGrid";
import { Badge } from "@/components/ui/badge";
import ChooseEwalletModal from "@/components/ChooseEwalletModal";
import EwalletTransactionModal from "@/components/EwalletTransactionModal";
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
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const ewalletProducts =
    products?.filter(
      (item) =>
        (item.category?.toLowerCase() === "emoney" ||
          item.category?.toLowerCase() === "e-money") &&
        item.is_active
    ) || [];
  const brandGroups = groupByBrand(ewalletProducts);

  // Fitur: ketika pilih ewallet brand dari modal, buka modal produk nominal
  function handleSelectBrand(brand: any) {
    if (brand.name === "ShopeePay" && brandGroups.ShopeePay) {
      setSelectedBrand("ShopeePay");
      setTransactionModalOpen(true);
    }
    else if (brand.name === "GoPay" && brandGroups.GoPay) {
      setSelectedBrand("GoPay");
      setTransactionModalOpen(true);
    }
    else if (brand.name === "OVO" && brandGroups.OVO) {
      setSelectedBrand("OVO");
      setTransactionModalOpen(true);
    }
    else if (brand.name === "Dana" && brandGroups.Dana) {
      setSelectedBrand("Dana");
      setTransactionModalOpen(true);
    }
    else if (brand.name === "LinkAja" && brandGroups.LinkAja) {
      setSelectedBrand("LinkAja");
      setTransactionModalOpen(true);
    }
    else if (brand.name === "i.Saku" && brandGroups["i.Saku"]) {
      setSelectedBrand("i.Saku");
      setTransactionModalOpen(true);
    }
    // Fallback tampilkan error atau toast di sini jika brand tidak ditemukan
  }

  // Dummy saldo, replace dengan data asli bila ada
  const saldo = 215000;
  const noRek = "8501 1423 2268 0010";

  return (
    <div className="min-h-screen bg-[#fef6ee] pb-24 md:pb-8">
      <div className="max-w-md mx-auto px-2 md:px-0">
        {/* Tombol Pilih E-Wallet */}
        <div className="flex justify-end pt-4 pb-2">
          <button
            className="bg-orange-500 text-white rounded-full px-5 py-2 font-semibold shadow hover:bg-orange-600 transition"
            onClick={()=>setChooseModalOpen(true)}
          >
            Pilih E-Wallet
          </button>
        </div>
        {/* Header Profile dan Saldo */}
        <div className="pt-6 pb-0 flex flex-col gap-4">
          {/* Mini profile */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-extrabold text-orange-600 border-2 border-orange-200 text-lg select-none">
              <Wallet className="w-7 h-7" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-bold text-base text-gray-800 leading-tight">Saldo E-Wallet</span>
              <span className="text-xs text-gray-500">No. Rekening: <span className="tracking-wider">{noRek}</span></span>
            </div>
            {/* Riwayat btn */}
            <button
              className="flex items-center gap-1 bg-white border border-orange-200 shadow text-[13px] px-3 py-1 font-semibold text-orange-600 rounded-full hover:bg-orange-100 transition"
              style={{ boxShadow: "0 2px 12px 0 #ffe6ce44" }}
            >
              <History className="w-4 h-4 mr-1 -ml-1" /> Riwayat
            </button>
          </div>

          {/* Card Saldo */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl shadow-md p-6 text-white flex flex-col gap-1 relative overflow-hidden animate-fade-in">
            <span className="text-sm font-medium flex items-center gap-1">
              Tabungan
              {/* Eye icon bisa ditambah jika ingin fitur show/hide */}
            </span>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight pt-1 pb-2 flex gap-2 items-end">
              <span>Rp{saldo.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex gap-7 text-xs mt-1 text-orange-100/90">
              <div>
                <span className="block">Pendapatan Bunga</span>
                <span className="block font-bold text-white">Rp 0</span>
              </div>
              <div>
                <span className="block">Suku Bunga</span>
                <span className="block font-bold text-white">2.3% p.a.</span>
              </div>
            </div>
            <span className="absolute right-6 top-3 opacity-10 text-9xl select-none pointer-events-none font-black">S</span>
          </div>
        </div>

        {/* Info: Endpoint */}
        <div className="flex justify-between bg-white rounded-xl mt-3 py-1.5 px-4 border border-orange-100 shadow-sm items-center mb-2">
          <span className="font-medium text-gray-600 text-[13px] flex items-center gap-1">
            <span>Transaksi digiflazz:</span>
          </span>
          <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 text-xs px-2">
            https://api.digiflazz.com/v1/transaction
          </Badge>
        </div>

        {/* Menu E-wallet Grid */}
        <div className="bg-white mt-4 rounded-2xl shadow-lg px-3 py-5 mb-7 animate-fade-in border border-orange-100">
          <div className="text-base font-semibold text-gray-800 mb-3 text-center">
            Pilih E-Wallet Favorit Anda
          </div>
          {isLoading ? (
            <div className="text-center py-7 text-orange-500 animate-pulse font-semibold">
              Memuat produk e-wallet...
            </div>
          ) : isError ? (
            <div className="text-center py-7 text-red-500 font-medium">
              Gagal memuat produk e-wallet.
            </div>
          ) : ewalletProducts.length === 0 ? (
            <div className="text-center text-muted-foreground text-base">
              Tidak ada produk e-wallet tersedia.
            </div>
          ) : (
            <EwalletBrandGrid brandGroups={brandGroups} />
          )}
        </div>

        {/* Catatan */}
        <div className="text-xs text-gray-500 text-center mb-3">
          Semua layanan transaksi dompet digital didukung 24 jam & aman.
        </div>
      </div>
      {/* Modal Pilih E-Wallet */}
      <ChooseEwalletModal
        open={chooseModalOpen}
        onOpenChange={setChooseModalOpen}
        ewalletList={DEMO_EWALLET_LIST}
        userEwallets={DEMO_USER_EWALLETS}
        onSelectBrand={(brand) => {
          setChooseModalOpen(false);
          setTimeout(() => handleSelectBrand(brand), 250);
        }}
      />
      {/* Modal Transaksi: buka grid brand produk brandGroups[selectedBrand] */}
      {selectedBrand && brandGroups[selectedBrand] && (
        <EwalletBrandGrid
          brandGroups={{ [selectedBrand]: brandGroups[selectedBrand] }}
        />
      )}
    </div>
  );
};

export default EWalletTransaksi;
