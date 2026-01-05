import React from 'react';
import { useWishlistStore } from '@/stores/useWishlistStore';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const wishlistItems = useWishlistStore((state) => state.wishlistItems);
    const isLoading = useWishlistStore((state) => state.isLoading);

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8 text-right" dir="rtl">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">قائمة الأمنيات</h1>
                <div className="flex gap-2 text-base md:text-lg text-primary">
                    <Link to="/" className="hover:underline">الرئيسية</Link>
                    <span>/</span>
                    <span className="font-semibold">قائمة الأمنيات</span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-10 lg:px-20 py-12" dir="rtl">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : wishlistItems?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={40} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">قائمة أمنياتك فارغة</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            يبدو أنك لم تضف أي منتج إلى قائمة أمنياتك حتى الآن. ابدأ بتصفح منتجاتنا وأضف ما يعجبك!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
                        >
                            تصفح المنتجات
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
