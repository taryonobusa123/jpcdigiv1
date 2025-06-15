
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

// Helper untuk mengelompokkan produk berdasarkan brand
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
  // Ambil produk ewallet dari tabel products (kategori emoney atau e-money)
  const { data: products, isLoading, isError } = useProducts();
  // Tampilkan hanya produk dengan kategori "emoney" atau "e-money" (case insensitive)
  const ewalletProducts =
    products?.filter(
      (item) =>
        (item.category?.toLowerCase() === "emoney" ||
          item.category?.toLowerCase() === "e-money") &&
        item.is_active
    ) || [];

  // Kelompokkan produk berdasarkan brand (misal: OVO, GoPay, Dana, dll)
  const brandGroups = groupByBrand(ewalletProducts);

  const handleTransaksi = (product: any) => {
    alert(
      `Transaksi ewallet akan dibuat untuk produk: ${product.product_name} (${product.buyer_sku_code})`
    );
    // Bisa dialihkan ke halaman detail/form transaksi sesuai kebutuhan aplikasi
  };

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
          Object.entries(brandGroups).map(([brand, brandProducts]) => (
            <div key={brand} className="mb-8">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-base">
                  {brand}
                </Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(brandProducts as any[]).map((product) => (
                  <Card key={product.sku} className="relative">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        {product.product_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline">{product.brand}</Badge>
                          <Badge>{product.category}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.description}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="font-semibold text-blue-600 text-lg">
                            Rp
                            {(Number(product.buyer_price || 0)).toLocaleString(
                              "id-ID"
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleTransaksi(product)}
                          >
                            Beli
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EWalletTransaksi;
