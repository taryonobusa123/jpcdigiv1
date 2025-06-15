
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Smartphone } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['pulsa-transaction', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pulsa_transactions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Sedang Diproses';
      case 'success':
        return 'Berhasil';
      case 'failed':
        return 'Gagal';
      default:
        return 'Status Tidak Diketahui';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
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

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/pulsa')}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Detail Transaksi</h1>
          </div>
        </div>
        
        <div className="p-4">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Transaksi tidak ditemukan</p>
              <Button 
                onClick={() => navigate('/pulsa')} 
                className="mt-4"
              >
                Kembali ke Pulsa
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
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pulsa')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <h1 className="text-lg font-bold">Detail Transaksi Pulsa</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Status Transaksi</span>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status || 'pending')}`}>
                {getStatusIcon(transaction.status || 'pending')}
                <span className="ml-2">{getStatusText(transaction.status || 'pending')}</span>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Pembelian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">ID Transaksi</span>
              <span className="font-mono text-sm">{transaction.ref_id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Nomor Tujuan</span>
              <span className="font-semibold">{transaction.phone_number}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Operator</span>
              <span className="font-medium">{transaction.operator}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Produk</span>
              <span className="font-medium">{transaction.product_name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Nominal</span>
              <span className="font-semibold">Rp {transaction.nominal?.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Harga</span>
              <span className="font-semibold">{formatCurrency(transaction.price)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal</span>
              <span>{formatDate(transaction.created_at)}</span>
            </div>
            
            {transaction.serial_number && (
              <div className="space-y-2">
                <span className="text-gray-600">Serial Number</span>
                <div className="text-sm bg-gray-100 p-3 rounded font-mono">
                  {transaction.serial_number}
                </div>
              </div>
            )}
            
            {transaction.message && (
              <div className="space-y-2">
                <span className="text-gray-600">Pesan</span>
                <div className="text-sm bg-gray-100 p-3 rounded">
                  {transaction.message}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Success Message */}
        {transaction.status === 'success' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Pembelian Berhasil!
                </h3>
                <p className="text-sm text-green-600">
                  Pulsa telah berhasil dikirim ke {transaction.phone_number}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/pulsa')} 
            variant="outline" 
            className="w-full"
          >
            Beli Pulsa Lagi
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            className="w-full"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TransactionDetail;
