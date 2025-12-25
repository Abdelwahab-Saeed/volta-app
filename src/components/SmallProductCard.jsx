import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from '@base-ui/react';
import { ShoppingCart } from 'lucide-react';

export default function SmallProductCard({ product }) {
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-4">
        <div className="mb-4 overflow-hidden border-b">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-sm font-medium mb-2 line-clamp-2 text-right">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-red-600">
            {product.price} EGP
          </span>
        </div>
        <Button className="w-full h-10 bg-[#31A0D3] hover:bg-[#0058AB] text-white">
          <div className="flex gap-2 justify-center items-center">
            <p className="text-lg">أضف إلى العربة</p>
            <ShoppingCart />
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
