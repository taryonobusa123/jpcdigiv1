
import React from "react";
import { Wallet } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-2 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-full shadow-lg bg-gradient-to-br from-purple-600 to-indigo-500">
              <Wallet className="w-8 h-8 text-white" />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Transaksi E-Wallet
            </h1>
          </div>
          <span className="text-sm text-slate-600 mt-2 text-center max-w-xl">
            Lakukan pembelian & top-up saldo e-wallet favorit Anda dengan mudah, aman, dan cepat.<br />
            Pilih brand e-wallet, lalu pilih nominal dan nomor tujuan.
          </span>
          <span className="text-xs bg-blue-100 border border-blue-300 px-2 py-0.5 rounded text-blue-700 mt-1">
            Otomatis 24 jam & dukungan saldo digital Indonesia
          </span>
        </div>

        {/* Info Box */}
        <div className="rounded-xl bg-white/70 shadow-md border border-gray-100 p-4 mb-8 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <span className="font-semibold text-slate-700">Info:</span> 
            <span className="ml-1 text-slate-600 text-sm">
              Semua transaksi diproses menggunakan platform resmi Digiflazz. Endpoint transaksi yang digunakan oleh server kami: 
              <Badge className="ml-2 px-2 bg-blue-200 text-blue-900" variant="secondary">
                https://api.digiflazz.com/v1/transaction
              </Badge>
            </span>
          </div>
        </div>

        {/* Daftar Brand Ewallet */}
        <div className="rounded-xl bg-white/80 shadow-lg p-4 md:p-8 mb-12 border border-slate-100 transition-colors">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-base font-semibold animate-pulse">
              Memuat produk e-wallet dari database...
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500 font-medium">
              Gagal memuat produk e-wallet.
            </div>
          ) : ewalletProducts.length === 0 ? (
            <div className="text-center text-muted-foreground text-base">Tidak ada produk e-wallet tersedia.</div>
          ) : (
            <EwalletBrandGrid brandGroups={brandGroups} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EWalletTransaksi;

