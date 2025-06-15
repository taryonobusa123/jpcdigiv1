
import React from "react";
import { Wallet } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import EwalletBrandGrid from "@/components/EwalletBrandGrid";
import { Badge } from "@/components/ui/badge";

// Helper mengelompokkan produk per brand
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
  // Ambil produk ewallet dari tabel products
  const { data: products, isLoading, isError } = useProducts();
  // Filter produk kategori emoney/e-money dan aktif
  const ewalletProducts =
    products?.filter(
      (item) =>
        (item.category?.toLowerCase() === "emoney" ||
          item.category?.toLowerCase() === "e-money") &&
        item.is_active
    ) || [];
  // Kelompok per brand
  const brandGroups = groupByBrand(ewalletProducts);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Wallet className="w-7 h-7 text-purple-600" /> Transaksi E-Wallet
        </h1>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Memuat produk e-wallet dari database...
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            Gagal memuat produk e-wallet.
          </div>
        ) : ewalletProducts.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Tidak ada produk e-wallet tersedia.
          </div>
        ) : (
          <EwalletBrandGrid brandGroups={brandGroups} />
        )}
      </div>
    </div>
  );
};

export default EWalletTransaksi;
