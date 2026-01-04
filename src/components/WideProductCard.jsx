import React from 'react';
import { Card, CardContent } from './ui/card';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

import { useCartStore } from "@/stores/useCartStore";
import { Loader2, Check } from "lucide-react";
import { useState } from "react";

export default function WideProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const isAdded = cartItems.some(item => item.product_id === product.id);
  const [addingStr, setAddingStr] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAdded) return;

    setAddingStr(true);
    await addToCart(product);
    setAddingStr(false);
  };

  return (
    <Card className="border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex">
          {/* Image Section - Left Side */}
          <div className="p-8 border-l border-slate-200">

            <img
              src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
              alt={product.name}
              className="object-contain max-h-56 drop-shadow-lg"
            />
          </div>
          {/* Content Section - Right Side */}
          <div className="flex-1 p-8 bg-white flex flex-col justify-between">
            {/* Product Title */}
            <div>
              <h3 className="text-2xl font-bold text-primary">
                {product.name} {product.discount > 0 && (
                  <span className="bg-secondary text-white px-2 rounded-md text-sm shadow-md">
                    {product.discount}%
                  </span>
                )}
              </h3>

              {product.description && (
                <p className="text-sm text-slate-600 text-right line-clamp-3">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between gap-4 mt-6">
              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={addingStr || isAdded}
                className={`h-12 px-10 rounded-md transition-colors ${isAdded
                  ? "bg-green-500 hover:bg-green-600 text-white cursor-default"
                  : "bg-[#31A0D3] hover:bg-[#2890C2] text-white"
                  }`}
              >
                <div className="flex gap-2 items-center">
                  {addingStr ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="text-base font-medium">تم الإضافة</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span className="text-base font-medium">أضف إلى العربة</span>
                    </>
                  )}
                </div>
              </Button>

              {/* Price Section */}
              <div className="flex flex-col items-end gap-1">
                {product.discount > 0 ? (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      EGP{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-3xl font-bold text-red-600">
                      EGP{product.final_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-red-600">
                    EGP{product.final_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>
          </div>


        </div>
      </CardContent>
    </Card>
  );
}