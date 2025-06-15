
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTopupRequests } from '@/hooks/useTopupRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';

const TopupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: topupRequests, isLoading } = useTopupRequests();

  const topupRequest = topupRequests?.find(request => request.id === id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Status Tidak Diketahui';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topupRequest) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/topup-history')}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Detail Top Up</h1>
          </div>
        </div>
        
        <div className="p-4">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Permintaan top up tidak ditemukan</p>
              <Button 
                onClick={() => navigate('/topup-history')} 
                className="mt-4"
              >
                Kembali ke Riwayat
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/topup-history')}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Detail Top Up</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Status Permintaan</span>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(topupRequest.status || 'pending')}`}>
                {getStatusIcon(topupRequest.status || 'pending')}
                <span className="ml-2">{getStatusText(topupRequest.status || 'pending')}</span>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Detail Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Top Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Jumlah</span>
              <span className="font-semibold">{formatCurrency(topupRequest.amount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Metode Pembayaran</span>
              <span className="font-medium capitalize">
                {topupRequest.payment_method.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal Permintaan</span>
              <span>{formatDate(topupRequest.created_at)}</span>
            </div>
            
            {topupRequest.proof_image && (
              <div className="space-y-2">
                <span className="text-gray-600">Bukti Transfer</span>
                <div className="text-sm bg-gray-100 p-3 rounded">
                  {topupRequest.proof_image}
                </div>
              </div>
            )}
            
            {topupRequest.admin_notes && (
              <div className="space-y-2">
                <span className="text-gray-600">Catatan Admin</span>
                <div className="text-sm bg-gray-100 p-3 rounded">
                  {topupRequest.admin_notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        {topupRequest.status === 'pending' && (
          <Card>
            <CardHeader>
              <CardTitle>Instruksi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>1. Transfer sesuai nominal yang tertera ke rekening yang telah disediakan</p>
                <p>2. Simpan bukti transfer sebagai referensi</p>
                <p>3. Tunggu konfirmasi dari admin (maksimal 1x24 jam)</p>
                <p>4. Saldo akan otomatis ditambahkan setelah dikonfirmasi</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/topup-history')} 
            variant="outline" 
            className="w-full"
          >
            Lihat Riwayat Top Up
          </Button>
          
          <Button 
            onClick={() => navigate('/topup-saldo')} 
            className="w-full"
          >
            Buat Permintaan Baru
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TopupDetail;
