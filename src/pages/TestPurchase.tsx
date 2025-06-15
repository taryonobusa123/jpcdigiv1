import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTestPurchase, useDigiflazzTransactions } from '@/hooks/useTestPurchase';
import { useSyncProducts } from '@/hooks/useSyncProducts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ShoppingCart, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TestPurchase() {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [customerId, setCustomerId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: products, isLoading: productsLoading } = useProducts(selectedCategory === 'all' ? undefined : selectedCategory);
  const { data: transactions, isLoading: transactionsLoading } = useDigiflazzTransactions();
  const testPurchase = useTestPurchase();
  const syncProducts = useSyncProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    { value: 'pulsa', label: 'Pulsa' },
    { value: 'data', label: 'Data' },
    { value: 'electricity', label: 'PLN' },
    { value: 'emoney', label: 'E-Money' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'voucher', label: 'Voucher' },
  ];

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

  const handlePurchase = async () => {
    if (!selectedProduct || !customerId) {
      toast({
        title: "Error",
        description: "Please select a product and enter customer ID",
        variant: "destructive",
      });
      return;
    }

    const product = products?.find(p => p.sku === selectedProduct);
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await testPurchase.mutateAsync({
        sku: product.sku,
        customer_id: customerId,
        product_name: product.product_name,
        price: product.buyer_price,
      });
      
      // Reset form
      setSelectedProduct('');
      setCustomerId('');
      
      toast({
        title: "Success",
        description: "Transaction has been submitted and will be processed",
      });
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Test Purchase</h1>
          </div>
          <Button 
            onClick={() => syncProducts.mutate()}
            disabled={syncProducts.isPending}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncProducts.isPending ? 'animate-spin' : ''}`} />
            {syncProducts.isPending ? 'Syncing...' : 'Sync Products'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Make Test Purchase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : products && products.length > 0 ? (
                      products?.map((product) => (
                        <SelectItem key={product.sku} value={product.sku}>
                          {product.product_name} - {formatCurrency(product.buyer_price)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-products" disabled>
                        No products found. Click "Sync Products" to load from Digiflazz
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer_id">Customer ID / Phone Number</Label>
                <Input
                  id="customer_id"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer ID or phone number"
                />
              </div>

              <Button 
                onClick={handlePurchase}
                disabled={testPurchase.isPending || !selectedProduct || !customerId}
                className="w-full"
              >
                {testPurchase.isPending ? 'Processing...' : 'Make Purchase'}
              </Button>
            </CardContent>
          </Card>

          {/* Product Info */}
          {selectedProduct && (
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const product = products?.find(p => p.sku === selectedProduct);
                  if (!product) return <p>Product not found</p>;
                  
                  return (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">SKU:</Label>
                        <p className="font-mono text-sm">{product.sku}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Name:</Label>
                        <p>{product.product_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Category:</Label>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Brand:</Label>
                        <p>{product.brand}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Price:</Label>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(product.buyer_price)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Description:</Label>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Transaction History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Test Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Serial Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.slice(0, 20).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.ref_id}</TableCell>
                      <TableCell>{transaction.customer_no}</TableCell>
                      <TableCell>{transaction.buyer_sku_code}</TableCell>
                      <TableCell>{formatCurrency(Number(transaction.price))}</TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === 'Sukses' ? 'default' :
                          transaction.status === 'Gagal' ? 'destructive' : 'secondary'
                        }>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.message}</TableCell>
                      <TableCell>{formatDate(transaction.updated_at || '')}</TableCell>
                      <TableCell className="font-mono text-xs">{transaction.sn}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
