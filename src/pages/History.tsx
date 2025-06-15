
import React from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    success: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    failed: "bg-red-100 text-red-600",
  };
  const icons = {
    success: <CheckCircle className="w-4 h-4 inline mr-1" />,
    pending: <Clock className="w-4 h-4 inline mr-1" />,
    failed: <XCircle className="w-4 h-4 inline mr-1" />,
  };
  const color = colors[status as keyof typeof colors] || "bg-gray-100 text-gray-500";
  const icon = icons[status as keyof typeof icons] || <Clock className="w-4 h-4 inline mr-1" />;
  let text = "Tidak Diketahui";
  if (status === "success") text = "Berhasil";
  else if (status === "pending") text = "Pending";
  else if (status === "failed") text = "Gagal";
  else if (status) text = status;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${color}`}>
      {icon}
      {text}
    </span>
  );
};

const History = () => {
  const { user } = useAuth();
  const { data: transactions, isLoading, error } = useTransactions();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pb-20">
        <div className="bg-white rounded-xl shadow p-6 mb-4 text-center">
          <h2 className="text-xl font-bold">Login Diperlukan</h2>
          <p className="text-gray-600">Silakan login untuk melihat riwayat transaksi Anda.</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold">Riwayat Transaksi</h1>
      </div>
      <div className="px-2 mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-center py-20">
            <XCircle className="w-10 h-10 text-red-400 mb-2" />
            <p className="text-red-500">Gagal memuat riwayat transaksi.</p>
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20">
            <Clock className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-gray-600">Belum ada transaksi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx: any) => (
              <div
                key={tx.id}
                className="bg-white rounded-xl shadow-sm px-4 py-2 border border-gray-100 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-800">{tx.type || "-"}</span>
                  <span className="font-bold text-sm text-gray-800">{tx.amount}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {tx.description || "-"}
                </div>
                {tx.ref_id && (
                  <div className="text-xs text-gray-400">ID: {tx.ref_id}</div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-400">
                    {tx.date} {tx.time}
                  </span>
                  <StatusBadge status={tx.status} />
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
