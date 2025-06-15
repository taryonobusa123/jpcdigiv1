
import React from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTopupRequests } from '@/hooks/useTopupRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '../components/BottomNavigation';

const TopupHistory = () => {
  const { data: topupRequests = [], isLoading } = useTopupRequests();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Transfer Bank';
      case 'e_wallet':
        return 'E-Wallet';
      case 'virtual_account':
        return 'Virtual Account';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <Link to="/topup-saldo" className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Riwayat Top Up</h1>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Link to="/topup-saldo" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Riwayat Top Up</h1>
        </div>
      </div>

      <div className="p-4">
        {topupRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Belum Ada Riwayat Top Up
              </h3>
              <p className="text-gray-500 mb-4">
                Anda belum pernah melakukan permintaan top up saldo
              </p>
              <Link
                to="/topup-saldo"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Top Up Sekarang
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {topupRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <h3 className="font-semibold text-gray-800">
                        {formatCurrency(request.amount)}
                      </h3>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Metode Pembayaran:</span>
                      <span className="font-medium">{getPaymentMethodName(request.payment_method)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tanggal:</span>
                      <span>{formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Transaksi:</span>
                      <span className="font-mono text-xs">{request.id.slice(0, 8)}...</span>
                    </div>
                  </div>

                  {request.admin_notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Catatan Admin:</span> {request.admin_notes}
                      </p>
                    </div>
                  )}

                  {request.proof_image && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Bukti Transfer:</p>
                      <img
                        src={request.proof_image}
                        alt="Bukti Transfer"
                        className="w-full max-w-sm rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TopupHistory;
