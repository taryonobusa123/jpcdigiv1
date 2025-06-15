
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { EWALLET_BRAND_LOGOS } from "./ewallet-brand-logos";

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
}

interface EwalletTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default function EwalletTransactionModal({
  open, onOpenChange, product,
}: EwalletTransactionModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  // Ambil logo brand
  const logoSrc = EWALLET_BRAND_LOGOS[product.brand.toLowerCase()] || null;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({ title: "Nomor e-wallet wajib diisi", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Request ke backend API/Edge Function
      const res = await fetch("/api/ewallet-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: product.sku,
          product_name: product.product_name,
          brand: product.brand,
          price: product.buyer_price,
          customer_id: phone,
        }),
      });

      let data: any = null;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.message || `Gagal memproses transaksi [${res.status}]`);
      }

      toast({
        title: "Berhasil!",
        description: `Transaksi ${product.product_name} telah diproses. Status: ${data.status || "Dikirim"}`,
      });
      onOpenChange(false);
      setPhone("");
    } catch (err: any) {
      toast({
        title: "Terjadi Kesalahan",
        description: err?.message || "Proses transaksi gagal. Silakan coba lagi beberapa saat.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md px-0 py-0 rounded-2xl overflow-hidden md:max-w-lg">
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 pb-2 border-b flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3 flex-col">
            <div className="rounded-full bg-white p-3 shadow-md border flex items-center justify-center">
              {logoSrc && !imgError ? (
                <img
                  src={logoSrc}
                  alt={product.brand}
                  className="w-12 h-12 object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="font-bold text-lg text-gray-500 uppercase px-3">{product.brand.slice(0,3)}</span>
              )}
            </div>
            <Badge variant="outline" className="capitalize">{product.brand}</Badge>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</span>
          </div>
          <div className="font-semibold text-lg mb-0 text-center">{product.product_name}</div>
          {product.description && <div className="text-xs text-muted-foreground text-center mb-2">{product.description}</div>}
          <div className="flex items-center justify-between w-full mt-3">
            <span className="font-bold text-blue-600 text-lg">
              Rp{Number(product.buyer_price).toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-slate-400">SKU: {product.sku}</span>
          </div>
        </div>
        <form onSubmit={handleBuy} className="p-6 pt-4">
          <div className="mb-3">
            <label htmlFor="ewallet-phone" className="block text-sm font-semibold mb-2">
              Nomor HP E-Wallet <span className="text-red-500">*</span>
            </label>
            <Input
              id="ewallet-phone"
              type="tel"
              autoFocus
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              disabled={loading}
              maxLength={20}
              className="text-base"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Beli Sekarang"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
