import React from 'react';
import { Card, CardContent } from './ui/card';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

export default function WideProductCard({ product }) {
  return (
    <Card className="border overflow-hidden hover:shadow-lg transition-shadow relative">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative bg-white md:w-1/3 lg:w-2/5 flex items-center justify-center p-6">
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold z-10">
                خصم {product.discount}%
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain max-h-64"
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 bg-white border-t md:border-t-0 md:border-r flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary text-right">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-4 text-right line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 mt-4">
              {/* Price Section */}
              <div className="flex items-center gap-3">
                {product.discount > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">
                      EGP{(product.price - (product.price * product.discount) / 100).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      EGP{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-red-600">
                    EGP{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button className="h-12 px-8 bg-[#31A0D3] hover:bg-[#0058AB] text-white">
                <div className="flex gap-2 items-center">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-base">أضف إلى العربة</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}