
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  brand: string;
  type: string;
  buyer_price: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

export default function ProductCard({ product, onBuy }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'telkomsel': return 'bg-red-500';
      case 'xl': return 'bg-blue-500';
      case 'indosat': return 'bg-yellow-500';
      case 'pln': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={`${getBrandColor(product.brand)} text-white`}>
            {product.brand.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.type}
          </Badge>
        </div>
        <CardTitle className="text-sm font-medium leading-tight">
          {product.product_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-blue-600">
              {formatPrice(product.buyer_price)}
            </div>
            <Button 
              size="sm" 
              onClick={() => onBuy(product)}
              className="text-xs"
            >
              Beli
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
