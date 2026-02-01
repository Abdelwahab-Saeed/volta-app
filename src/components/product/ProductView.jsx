import React from 'react';
import {
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    ArrowLeftRight,
    Check,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import SafeImage from '../common/SafeImage';

export default function ProductView({
    product,
    quantity,
    setQuantity,
    onAddToCart,
    onBuyNow,
    onToggleWishlist,
    onToggleComparison,
    isInWishlist,
    isInComparison,
    isAdded,
    addingLoading
}) {
    const { t } = useTranslation();
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
            {/* Gallery Section */}
            <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 flex items-center justify-center aspect-square relative group overflow-hidden">
                    <SafeImage
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
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-secondary">
                            <span dir="ltr">{t('common.currency')} {product.final_price?.toLocaleString()}</span>
                        </span>
                        {product.discount > 0 && (
                            <span className="text-2xl text-slate-300 line-through">
                                <span dir="ltr">{t('common.currency')} {product.price?.toLocaleString()}</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg">{t('product.description')}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                        {product.description || t('product.no_description')}
                    </p>
                </div>

                <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
                    {/* Bundle Offers */}
                    {product.bundle_offers && product.bundle_offers.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-bold text-slate-900 text-lg">{t('product.bundle_offers')}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {product.bundle_offers.map((offer) => (
                                    <div
                                        key={offer.id}
                                        onClick={() => setQuantity(offer.quantity)}
                                        className={`cursor-pointer border-2 rounded-xl p-3 transition-all hover:shadow-md text-center ${quantity === offer.quantity
                                            ? 'border-secondary bg-blue-50'
                                            : 'border-slate-100 hover:border-secondary/50'
                                            }`}
                                    >
                                        <p className="font-bold text-slate-800 text-lg">{offer.quantity} {t('product.pieces')}</p>
                                        <p className="font-bold text-secondary text-base">
                                            <span dir="ltr">{t('common.currency')} {Number(offer.bundle_price).toLocaleString()}</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            ({Math.round(offer.bundle_price / offer.quantity).toLocaleString()} / {t('product.per_piece')})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        <span className="font-bold text-slate-900">{t('product.quantity_label')}:</span>
                        <div className="flex items-center border border-slate-300 rounded-xl h-12 overflow-hidden">
                            <button
                                onClick={incrementQuantity}
                                className="w-12 h-full flex items-center justify-center hover:bg-slate-50 transition-colors border-l border-slate-300"
                            >
                                <Plus size={18} />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val > 0) setQuantity(val);
                                }}
                                className="w-16 text-center font-bold text-lg text-slate-800 focus:outline-none"
                            />
                            <button
                                onClick={decrementQuantity}
                                className="w-12 h-full flex items-center justify-center hover:bg-slate-50 transition-colors border-r border-slate-300"
                            >
                                <Minus size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                            <Button
                                onClick={onAddToCart}
                                disabled={addingLoading || isAdded}
                                className={`flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 ${isAdded
                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-green-100"
                                    : "bg-white border-2 border-[#31A0D3] text-[#31A0D3] hover:bg-blue-50 shadow-blue-50"
                                    }`}
                            >
                                {addingLoading ? (
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                ) : isAdded ? (
                                    <div className="flex items-center gap-2">
                                        <Check className="h-6 w-6" />
                                        <span>{t('product.added')}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="h-6 w-6" />
                                        <span>{t('product.add_to_cart')}</span>
                                    </div>
                                )}
                            </Button>

                            <Button
                                onClick={onBuyNow}
                                disabled={addingLoading}
                                className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 bg-gradient-to-r from-[#31A0D3] to-[#2890C2] hover:from-[#2890C2] hover:to-[#1e7ca8] text-white shadow-blue-100"
                            >
                                {addingLoading ? (
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                ) : (
                                    <span>{t('product.buy_now')}</span>
                                )}
                            </Button>
                        </div>

                        <div className="flex gap-4 justify-center mt-2">
                            <button
                                onClick={onToggleWishlist}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isInWishlist
                                    ? 'text-red-500 bg-red-50'
                                    : 'text-slate-500 hover:text-red-500 hover:bg-red-50'
                                    }`}
                            >
                                <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                                <span className="font-medium">{t('product.wishlist')}</span>
                            </button>
                            <button
                                onClick={onToggleComparison}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isInComparison
                                    ? 'text-primary bg-blue-50'
                                    : 'text-slate-500 hover:text-primary hover:bg-blue-50'
                                    }`}
                            >
                                <ArrowLeftRight size={20} />
                                <span className="font-medium">{t('product.compare')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
