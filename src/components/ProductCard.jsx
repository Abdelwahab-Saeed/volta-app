import React from 'react';
import { Card, CardContent } from './ui/card';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

export default function ProductCard({ product }) {
  return (
    <Card className="border overflow-hidden hover:shadow-lg transition-shadow relative">
      <CardContent className="p-0">
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-[#0058AB] text-white px-2 py-1 rounded-md text-xs font-bold z-10">
            {product.discount}%
          </div>
        )}

        <div className="bg-white p-4 flex items-center justify-center aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-4 bg-white border-t">
          <h3 className="text-sm font-medium mb-3 text-start min-h-10 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-end gap-2 mb-3">
            {product.discount > 0 ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {product.price} EGP
                </span>
                <span className="text-lg font-bold text-red-600">
                  {(
                    product.price -
                    (product.price * product.discount) / 100
                  ).toFixed(2)}{' '}
                  EGP
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-red-600">
                {product.price} EGP
              </span>
            )}
          </div>

          <Button className="w-full h-11 bg-[#31A0D3] hover:bg-[#0058AB] text-white">
            <div className="flex gap-2 justify-center items-center">
              <ShoppingCart />
              <span className="text-lg">أضف إلى العربة</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
