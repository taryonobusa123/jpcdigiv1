
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

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

  if (!product) return null;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({ title: "Nomor e-wallet wajib diisi", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // 1. Simpan transaksi ke database: request ke edge function/backend
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Gagal memproses transaksi");
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
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembelian E-Wallet</DialogTitle>
          <DialogDescription>
            Silakan cek detail pembelian di bawah dan masukkan nomor e-wallet tujuan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBuy} className="space-y-4">
          <div className="rounded bg-gray-50 p-3 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge>{product.brand}</Badge>
              <span className="text-xs text-muted-foreground">{product.category}</span>
            </div>
            <div className="font-medium text-base">{product.product_name}</div>
            <div className="text-xs text-muted-foreground">{product.description}</div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="font-semibold text-blue-600">
                Rp{Number(product.buyer_price).toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-slate-500">SKU: {product.sku}</span>
            </div>
          </div>
          <div>
            <label htmlFor="ewallet-phone" className="block text-sm font-medium mb-1">
              Nomor HP E-Wallet
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
            />
          </div>
          <div className="flex gap-2">
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
