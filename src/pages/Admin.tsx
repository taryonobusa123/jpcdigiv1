
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminStats, useAdminTransactions, useAdminTopupRequests, useUpdateTopupRequest, useSyncProducts, useRefundTransaction } from '@/hooks/useAdmin';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProductPricingManager from '@/components/admin/ProductPricingManager';
import AdminSettings from "@/components/admin/AdminSettings";
import AdminStatsCards from "./admin/AdminStatsCards";
import AdminTransactionsTable from "./admin/AdminTransactionsTable";
import AdminTopupRequestsTable from "./admin/AdminTopupRequestsTable";
import AdminProductsTable from "./admin/AdminProductsTable";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ShoppingCart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user, profile } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: transactions, isLoading: transactionsLoading } = useAdminTransactions();
  const { data: topupRequests, isLoading: topupLoading } = useAdminTopupRequests();
  const { data: products, isLoading: productsLoading } = useProducts();
  const updateTopupRequest = useUpdateTopupRequest();
  const refundTransaction = useRefundTransaction();
  const syncProducts = useSyncProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const handleTopupAction = async (id: string, status: string, adminNotes?: string) => {
    try {
      await updateTopupRequest.mutateAsync({ id, status, adminNotes });
    } catch (error) {
      console.error('Error updating topup request:', error);
    }
  };

  const handleRefund = async (transaction: any) => {
    try {
      await refundTransaction.mutateAsync(transaction);
    } catch (error) {
      console.error('Error refunding transaction:', error);
    }
  };

  const handleSyncProducts = async () => {
    try {
      await syncProducts.mutateAsync();
    } catch (error) {
      console.error('Error syncing products:', error);
    }
  };

  const handleTestPurchase = () => {
    navigate('/test-purchase');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <Button onClick={handleTestPurchase} variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Test Purchase
            </Button>
            <Button onClick={handleSyncProducts} disabled={syncProducts.isPending}>
              <RefreshCw className={`w-4 h-4 mr-2 ${syncProducts.isPending ? 'animate-spin' : ''}`} />
              Sync Products
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards stats={stats} isLoading={statsLoading} formatCurrency={formatCurrency} />

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="topup-requests">Top Up Requests</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTransactionsTable
                  transactions={transactions}
                  isLoading={transactionsLoading}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  onRefund={handleRefund}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topup-requests">
            <Card>
              <CardHeader>
                <CardTitle>Top Up Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTopupRequestsTable
                  topupRequests={topupRequests}
                  isLoading={topupLoading}
                  updateTopupRequest={updateTopupRequest}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  handleTopupAction={handleTopupAction}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Available Products</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminProductsTable
                  products={products}
                  isLoading={productsLoading}
                  formatCurrency={formatCurrency}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <ProductPricingManager />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
