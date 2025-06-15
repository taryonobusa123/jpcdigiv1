
import React from "react";
import { Wallet, History } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import EwalletBrandGrid from "@/components/EwalletBrandGrid";
import { Badge } from "@/components/ui/badge";

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
  const ewalletProducts =
    products?.filter(
      (item) =>
        (item.category?.toLowerCase() === "emoney" ||
          item.category?.toLowerCase() === "e-money") &&
        item.is_active
    ) || [];
  const brandGroups = groupByBrand(ewalletProducts);

  // Dummy saldo, replace dengan data asli bila ada
  const saldo = 215000;
  const noRek = "8501 1423 2268 0010";

  return (
    <div className="min-h-screen bg-[#fef6ee] pb-24 md:pb-8">
      <div className="max-w-md mx-auto px-2 md:px-0">
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
    </div>
  );
};

export default EWalletTransaksi;
