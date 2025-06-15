import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EWALLET_BRAND_LOGOS } from "./ewallet-brand-logos";
import EwalletTransactionModal from "./EwalletTransactionModal";

type Product = {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  brand: string;
  type?: string;
  buyer_price: number;
  description: string;
  buyer_sku_code?: string;
};

interface EwalletBrandGridProps {
  brandGroups: { [brand: string]: Product[] };
}

const COLORS = [
  "bg-[#A259FF]", // ungu (OVO)
  "bg-[#00AA13]", // hijau (GoPay)
  "bg-[#0097E6]", // biru (DANA)
  "bg-[#FEDD00]", // kuning (LinkAja)
  "bg-[#FF5B37]", // orange/merah
  "bg-gray-400",
];

function pickColor(idx: number) {
  return COLORS[idx % COLORS.length];
}

const EwalletBrandGrid: React.FC<EwalletBrandGridProps> = ({ brandGroups }) => {
  const brandNames = Object.keys(brandGroups).sort();
  const [openBrand, setOpenBrand] = useState<string | null>(null);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setTransactionModalOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-6 my-8">
        {brandNames.map((brand, idx) => {
          const logoSrc = EWALLET_BRAND_LOGOS[brand.toLowerCase()] || null;
          const showFallback = imgError[brand] || !logoSrc;
          return (
            <button
              key={brand}
              onClick={() => setOpenBrand(brand)}
              className="flex flex-col items-center gap-2 group select-none"
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-lg font-bold text-3xl md:text-4xl text-white ${pickColor(idx)} group-hover:scale-105 transition-transform bg-white/20`}
              >
                {!showFallback ? (
                  <img
                    src={logoSrc}
                    alt={brand}
                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    loading="lazy"
                    onError={() => setImgError((err) => ({ ...err, [brand]: true }))}
                  />
                ) : (
                  <span className="uppercase">{brand.slice(0, 3)}</span>
                )}
              </div>
              <span className="text-sm mt-1 font-medium">{brand}</span>
            </button>
          );
        })}
      </div>

      {/* Modal produk-produk per brand */}
      {openBrand && (
        <Dialog open onOpenChange={() => setOpenBrand(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Produk {openBrand}</DialogTitle>
              <DialogDescription>Pilih nominal/top up produk e-wallet {openBrand}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
              {brandGroups[openBrand]?.map((product) => (
                <Card key={product.sku} className="p-4 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{product.brand}</Badge>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="text-base font-medium">{product.product_name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{product.description}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-semibold text-blue-600 text-lg">
                      Rp{Number(product.buyer_price || 0).toLocaleString("id-ID")}
                    </div>
                    <Button size="sm" onClick={() => {
                      setOpenBrand(null);
                      handleBuy(product);
                    }}>
                      Beli
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Modal transaksi: detail + input + konfirmasi */}
      <EwalletTransactionModal
        open={transactionModalOpen}
        onOpenChange={(open) => {
          setTransactionModalOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
};

export default EwalletBrandGrid;
