import React from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Loader2,
  Check,
  ArrowLeftRight
} from "lucide-react";
import {
  Link
} from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { useState } from "react";
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProductCard({
  product
}) {
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
    e.stopPropagation();
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
    e.stopPropagation();
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
      // Errors are handled in the store (toast)
    }
  };
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation if wrapped in Link
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }
    if (isAdded) return;

    setAddingStr(true);
    await addToCart(product);
    setAddingStr(false);
  };

  return (
    <div className="group relative bg-white rounded-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        {product.discount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleWishlistToggle}
          className={`p-2 bg-white rounded-full shadow-md transition-colors ${isInWishlist ? 'text-red-500 bg-red-50' : 'hover:bg-red-50 hover:text-red-500'
            }`}
        >
          <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleComparisonToggle}
          className={`p-2 bg-white rounded-full shadow-md transition-colors ${isInComparison ? 'text-primary bg-blue-50' : 'hover:bg-blue-50 hover:text-primary'
            }`}
        >
          <ArrowLeftRight size={18} />
        </button>
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="bg-white p-4 flex items-center justify-center aspect-square">
          <img
            src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 border-t border-slate-100">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-slate-800 font-bold mb-1 hover:text-primary transition-colors text-lg truncate">
            {product.name}
          </h3>
        </Link>


        <div className="mt-3">
          <div className='my-6 flex items-center'>
            <p className="text-lg font-semibold text-red-700">EGP {product.final_price}</p>
            {product.discount && (
              <p className="text-md text-slate-400 line-through mr-2">EGP {product.price}</p>
            )}
          </div>
          <div>
            <button
              onClick={handleAddToCart}
              disabled={addingStr || isAdded}
              className={`flex items-center justify-center gap-2 w-full h-11 transition-all duration-300 rounded-md text-white ${isAdded
                ? "bg-green-500 hover:bg-green-600 cursor-default"
                : "bg-[#31A0D3] hover:bg-[#0058AB]"
                }`}
            >
              {addingStr ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isAdded ? (
                <>
                  <Check size={20} />
                  <span className="text-lg">تم الإضافة</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span className="text-lg">أضف إلى العربة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
