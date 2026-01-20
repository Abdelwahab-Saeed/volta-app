import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Check, Heart, ArrowLeftRight } from 'lucide-react';
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function SmallProductCard({ product }) {
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
      // Errors handled in store
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
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
    <Card className="overflow-hidden border">
      <CardContent className="p-4">
        <div className="relative mb-4 overflow-hidden border-b">
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            <button
              onClick={handleWishlistToggle}
              className={`p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-colors ${isInWishlist ? 'text-red-500' : 'hover:text-red-500'
                }`}
            >
              <Heart size={14} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleComparisonToggle}
              className={`p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-colors ${isInComparison ? 'text-primary' : 'hover:text-primary'
                }`}
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>
          <Link to={`/product/${product.id}`}>
            <img
              src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
              alt={product.name}
              className="w-full h-full object-contain transition-transform hover:scale-110 duration-500"
            />
          </Link>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium mb-2 line-clamp-2 text-right hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-red-600">
            {product.final_price} EGP
          </p>
          {product.discount > 0 ? (
            <p className="text-md text-slate-400 line-through mr-2">EGP {product.price}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
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
          <Button
            onClick={async (e) => {
              e.preventDefault();
              setAddingStr(true);
              try {
                await addToCart(product);
                navigate('/checkout');
              } catch (error) {
                console.error(error);
              } finally {
                setAddingStr(false);
              }
            }}
            disabled={addingStr}
            className="w-full h-10 text-white bg-secondary hover:bg-[#0090c7]"
          >
            <span className="text-lg">شراء الآن</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
