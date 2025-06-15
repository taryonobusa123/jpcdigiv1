
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";

export default function AdminProductsTable({ products, isLoading, formatCurrency }) {
  return (
    <div>
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Seller Price</TableHead>
              <TableHead>Buyer Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.filter((product) =>
              product.category === "pascabayar" ||
              product.category === "pulsa" ||
              product.category === "data" ||
              product.category === "electricity" ||
              product.category === "emoney" ||
              product.category === "gaming" ||
              product.category === "voucher"
            ).slice(0, 50).map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {product.category === "pascabayar"
                      ? "Pascabayar"
                      : product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{formatCurrency(product.seller_price)}</TableCell>
                <TableCell>{formatCurrency(product.buyer_price)}</TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
