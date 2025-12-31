import React from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Loader2,
  Check
} from "lucide-react";
import {
  Link
} from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductCard({
  product
}) {
  const { addToCart, isInCart } = useCart();
  const [addingStr, setAddingStr] = useState(false);

  const isAdded = isInCart(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation if wrapped in Link
    if (isAdded) return;

    setAddingStr(true);
    await addToCart(product);
    setAddingStr(false);
  };

  if(product.discount > 0) {
    product.oldPrice = product.price;
    product.price = Math.round(product.price - (product.price * product.discount / 100));
  }

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
        <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      {/* Image */}
      <Link to={`/products/${product.id}`}>
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
        <Link to={`/products/${product.id}`}>
          <h3 className="text-slate-800 font-bold mb-1 hover:text-primary transition-colors text-lg truncate">
            {product.name}
          </h3>
        </Link>
        

        <div className="mt-3">
          <div className='my-6 flex items-center'>
            <p className="text-lg font-semibold text-red-700">EGP {product.price}</p>
            {product.oldPrice && (
              <p className="text-md text-slate-400 line-through mr-2">EGP {product.oldPrice}</p>
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
