import React from 'react';
import { Card, CardContent } from './ui/card';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { Loader2, Check, Heart, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function WideProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const addToComparison = useComparisonStore((state) => state.addToComparison);
  const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);
  const isInComparison = useComparisonStore((state) => state.isInComparison(product.id));
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isAdded = cartItems.some(item => item.product_id === product.id);
  const [addingStr, setAddingStr] = useState(false);
  const navigate = useNavigate();

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product);
    } catch (error) {
      // Handled in store
    }
  };

  const handleComparisonToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }
    try {
      if (isInComparison) {
        await removeFromComparison(product.id);
      } else {
        await addToComparison(product);
      }
    } catch (error) {
      // Errors are handled in store
    }
  };

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
            <Link to={`/product/${product.id}`}>
              <img
                src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
                alt={product.name}
                className="object-contain max-h-56 drop-shadow-lg transition-transform hover:scale-105"
              />
            </Link>
          </div>
          {/* Content Section - Right Side */}
          <div className="flex-1 p-8 bg-white flex flex-col justify-between">
            {/* Product Title */}
            <div>
              <div className="flex justify-between items-start">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-2xl font-bold text-primary hover:text-secondary transition-colors">
                    {product.name} {product.discount > 0 && (
                      <span className="bg-secondary text-white px-2 rounded-md text-sm shadow-md mr-2">
                        {product.discount}%
                      </span>
                    )}
                  </h3>
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 bg-white rounded-full border border-slate-200 transition-colors ${isInWishlist ? 'text-red-500 bg-red-50 border-red-100' : 'hover:bg-red-50 hover:text-red-500'
                      }`}
                  >
                    <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={handleComparisonToggle}
                    className={`p-2 bg-white rounded-full border border-slate-200 transition-colors ${isInComparison ? 'text-primary bg-blue-50 border-blue-100' : 'hover:bg-blue-50 hover:text-primary'
                      }`}
                  >
                    <ArrowLeftRight size={20} />
                  </button>
                </div>
              </div>

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