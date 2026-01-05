import React, { useState } from 'react';
import {
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    ArrowLeftRight,
    Shield,
    Truck,
    RotateCcw,
    Check,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductView({
    product,
    quantity,
    setQuantity,
    onAddToCart,
    onToggleWishlist,
    onToggleComparison,
    isInWishlist,
    isInComparison,
    isAdded,
    addingLoading
}) {
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
            {/* Gallery Section */}
            <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 flex items-center justify-center aspect-square relative group overflow-hidden">
                    <img
                        src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-1.5 rounded-full font-bold shadow-lg text-lg">
                            -{product.discount}%
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                {/* <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:shadow-md">
                        <Truck className="text-secondary mb-2" size={24} />
                        <span className="text-xs font-semibold text-slate-700">شحن سريع</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:shadow-md">
                        <Shield className="text-secondary mb-2" size={24} />
                        <span className="text-xs font-semibold text-slate-700">ضمان عامين</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:shadow-md">
                        <RotateCcw className="text-secondary mb-2" size={24} />
                        <span className="text-xs font-semibold text-slate-700">إرجاع خلال 14 يوم</span>
                    </div>
                </div> */}
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">متوفر</span>
                        <div className="flex text-yellow-500 ml-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" />
                            ))}
                        </div>
                        <span className="text-slate-400 text-sm">(4.8)</span>
                    </div>

                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-secondary">
                            EGP {product.final_price?.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-2xl text-slate-300 line-through">
                                EGP {product.price?.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg">الوصف</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        {product.description || "لا يوجد وصف متاح لهذا المنتج حالياً. يتميز هذا المنتج بجودة عالية وتصميم عصري يناسب احتياجاتكم."}
                    </p>
                </div>

                <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-6">
                        <span className="font-bold text-slate-900">الكمية:</span>
                        <div className="flex items-center bg-slate-100 rounded-xl h-12 overflow-hidden">
                            <span className="w-12 text-center font-bold text-lg text-slate-800">{quantity}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={onAddToCart}
                            disabled={addingLoading || isAdded}
                            className={`flex-1 h-14 text-xl font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 ${isAdded
                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-green-100"
                                    : "bg-gradient-to-r from-[#31A0D3] to-[#2890C2] hover:from-[#2890C2] hover:to-[#1e7ca8] text-white shadow-blue-100"
                                }`}
                        >
                            {addingLoading ? (
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            ) : isAdded ? (
                                <div className="flex items-center gap-2">
                                    <Check className="h-6 w-6" />
                                    <span>تمت الإضافة</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-6 w-6" />
                                    <span>أضف إلى السلة</span>
                                </div>
                            )}
                        </Button>

                        <button
                            onClick={onToggleWishlist}
                            className={`h-14 w-14 rounded-2xl border flex items-center justify-center transition-all transform active:scale-90 ${isInWishlist
                                    ? 'bg-red-50 border-red-100 text-red-500 shadow-md'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                                }`}
                        >
                            <Heart size={28} fill={isInWishlist ? "currentColor" : "none"} />
                        </button>

                        <button
                            onClick={onToggleComparison}
                            className={`h-14 w-14 rounded-2xl border flex items-center justify-center transition-all transform active:scale-90 ${isInComparison
                                    ? 'bg-blue-50 border-blue-100 text-primary shadow-md'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-primary hover:border-blue-200 hover:bg-blue-50'
                                }`}
                        >
                            <ArrowLeftRight size={28} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
