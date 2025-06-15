
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "../components/BottomNavigation";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const StatusBadge = ({ status }: { status?: string }) => {
  const variants: { [key: string]: { color: string; icon: React.ReactNode; text: string } } = {
    success: { color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-4 h-4 mr-1" />, text: "Berhasil" },
    pending: { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-4 h-4 mr-1" />, text: "Pending" },
    failed: { color: "bg-red-100 text-red-700", icon: <XCircle className="w-4 h-4 mr-1" />, text: "Gagal" },
  };
  const variant = variants[status ?? "pending"] || { color: "bg-gray-100 text-gray-600", icon: <Clock className="w-4 h-4 mr-1" />, text: status };
  return (
    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${variant.color}`}>
      {variant.icon}
      {variant.text}
    </span>
  );
};

const fetchTransactions = async (userId: string) => {
  if (!userId) throw new Error("User belum login/sesi kadaluwarsa");
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

const History = () => {
  const { user } = useAuth();

  const { data: transactions, isLoading, error, refetch } = useQuery({
    queryKey: ["transactions-history", user?.id],
    queryFn: () => fetchTransactions(user?.id as string),
    enabled: !!user,
  });

  React.useEffect(() => {
    // Untuk debug: log hasil query ke console
    console.log("Result data transactions:", transactions);
    if (error) {
      console.error("Error fetch transactions:", error);
    }
  }, [transactions, error]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pb-20">
        <div className="bg-white rounded-xl shadow p-6 mb-4 text-center border">
          <h2 className="text-xl font-bold mb-2">Login Diperlukan</h2>
          <p className="text-gray-600">Silakan login untuk melihat riwayat transaksi Anda.</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200 p-4 flex items-center gap-2">
        <span className="font-semibold text-blue-700 text-lg">Riwayat Transaksi</span>
        <button
          onClick={() => refetch()}
          className="ml-auto bg-blue-50 text-blue-700 border border-blue-100 rounded px-2 py-1 text-xs hover:bg-blue-100 transition"
          type="button"
        >
          Refresh
        </button>
      </div>
      <div className="px-2 mt-4 w-full max-w-md mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-center py-20">
            <XCircle className="w-10 h-10 text-red-400 mb-2" />
            <p className="text-red-500 mb-2">Gagal memuat riwayat transaksi.</p>
            <button
              onClick={() => refetch()}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs border hover:bg-gray-200"
              type="button"
            >
              Coba lagi
            </button>
            <span className="mt-2 text-xs text-gray-400 break-all">{String(error?.message || "")}</span>
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20">
            <Clock className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">Belum ada transaksi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Judul Kolom */}
            <div className="grid grid-cols-6 gap-2 font-semibold text-xs text-gray-700 px-2 pb-1">
              <div>Tanggal</div>
              <div>Produk</div>
              <div className="col-span-2">Customer ID</div>
              <div>Harga</div>
              <div>Status</div>
            </div>
            {/* Daftar Transaksi */}
            {transactions.map((tx: any) => (
              <div key={tx.id} className="grid grid-cols-6 gap-2 bg-white rounded-lg border border-gray-100 px-2 py-2 text-xs items-center">
                <div className="truncate">
                  {tx.created_at ? new Date(tx.created_at).toLocaleDateString("id-ID") : "-"}
                  <br />
                  <span className="text-gray-400">{tx.created_at ? new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                </div>
                <div className="truncate">{tx.product_name ?? "-"}</div>
                <div className="col-span-2 truncate">{tx.customer_id ?? "-"}</div>
                <div className="font-medium text-right pr-1 text-gray-700">
                  Rp{Number(tx.price).toLocaleString("id-ID")}
                </div>
                <div>
                  <StatusBadge status={tx.status} />
                  <div className="text-gray-400 mt-1">ID: {tx.ref_id ?? "-"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default History;
