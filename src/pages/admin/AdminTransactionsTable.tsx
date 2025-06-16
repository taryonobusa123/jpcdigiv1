
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function AdminTransactionsTable({ 
  transactions, 
  isLoading, 
  formatCurrency, 
  formatDate,
  onRefund 
}) {
  return (
    <div>
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.slice(0, 20).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.profiles.full_name}</div>
                    <div className="text-sm text-gray-500">{transaction.profiles.email}</div>
                  </div>
                </TableCell>
                <TableCell>{transaction.product_name}</TableCell>
                <TableCell>{transaction.customer_id}</TableCell>
                <TableCell>{formatCurrency(transaction.price)}</TableCell>
                <TableCell>
                  <Badge variant={
                    transaction.status === "Sukses"
                      ? "default"
                      : transaction.status === "Gagal"
                        ? "destructive"
                        : "secondary"
                  }>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(transaction.created_at)}</TableCell>
                <TableCell>
                  {transaction.status === "Gagal" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRefund(transaction)}
                      disabled={transaction.is_refunded}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {transaction.is_refunded ? "Refunded" : "Refund"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
