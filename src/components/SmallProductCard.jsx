import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { useCart } from "@/context/CartContext";

export default function SmallProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const [addingStr, setAddingStr] = useState(false);

  const isAdded = isInCart(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAdded) return;

    setAddingStr(true);
    await addToCart(product);
    setAddingStr(false);
  };

  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-4">
        <div className="mb-4 overflow-hidden border-b">
          <img
            src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
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
        <Button
          onClick={handleAddToCart}
          disabled={addingStr || isAdded}
          className={`w-full h-10 text-white ${isAdded
              ? "bg-green-500 hover:bg-green-600 cursor-default"
              : "bg-[#31A0D3] hover:bg-[#0058AB]"
            }`}
        >
          <div className="flex gap-2 justify-center items-center">
            {addingStr ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isAdded ? (
              <>
                <p className="text-lg">تم الإضافة</p>
                <Check />
              </>
            ) : (
              <>
                <p className="text-lg">أضف إلى العربة</p>
                <ShoppingCart />
              </>
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
