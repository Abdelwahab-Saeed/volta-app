import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Clock, Tag, Package, ShoppingBag, ArrowLeft, Loader2,
    CheckCircle, ShoppingCart, AlertTriangle
} from 'lucide-react';
import { getOfferDetails } from '@/api/offers.api';
import { useLocalize } from '@/lib/localize';
import SafeImage from '@/components/common/SafeImage';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

const TYPE_CONFIG = {
    percentage:    { label: 'نسبة خصم', labelEn: 'Discount %',   color: 'from-purple-500 to-purple-700', badge: 'bg-purple-100 text-purple-700 border border-purple-200' },
    fixed:         { label: 'خصم ثابت', labelEn: 'Fixed Off',     color: 'from-blue-500 to-blue-700',     badge: 'bg-blue-100 text-blue-700 border border-blue-200' },
    bundle:        { label: 'باقة',      labelEn: 'Bundle Deal',   color: 'from-orange-500 to-orange-700', badge: 'bg-orange-100 text-orange-700 border border-orange-200' },
    buy_x_get_y:   { label: 'اشترِ X',  labelEn: 'Buy X Get Y',   color: 'from-green-500 to-green-700',   badge: 'bg-green-100 text-green-700 border border-green-200' },
    spend_x_get_y: { label: 'اصرف X',   labelEn: 'Spend & Save',  color: 'from-pink-500 to-pink-700',     badge: 'bg-pink-100 text-pink-700 border border-pink-200' },
};

function getOfferDescription(offer, lang) {
    const ar = {
        percentage:    `احصل على خصم ${offer.value}% على كل منتج مشمول في هذا العرض.`,
        fixed:         `احصل على خصم ${offer.value} ج.م على كل منتج مشمول في هذا العرض.`,
        bundle:        `اشترِ جميع منتجات الباقة معاً واستمتع بسعر إجمالي خاص ${offer.bundle_price} ج.م.`,
        buy_x_get_y:   `اشترِ ${offer.buy_quantity} قطع واحصل على ${offer.get_quantity} ${offer.get_product_id ? 'من منتج آخر' : 'من نفس المنتج'} مجاناً.`,
        spend_x_get_y: `اصرف ${offer.min_spend} ج.م أو أكثر واحصل على خصم ${offer.discount_amount} ج.م فوراً.`,
    };
    const en = {
        percentage:    `Get ${offer.value}% off on every included product.`,
        fixed:         `Get EGP ${offer.value} off on every included product.`,
        bundle:        `Buy all bundle products together and pay only EGP ${offer.bundle_price}.`,
        buy_x_get_y:   `Buy ${offer.buy_quantity} items and get ${offer.get_quantity} ${offer.get_product_id ? 'of another product' : 'of the same product'} for free.`,
        spend_x_get_y: `Spend EGP ${offer.min_spend} or more and instantly get EGP ${offer.discount_amount} off.`,
    };
    return lang === 'ar' ? (ar[offer.type] || '') : (en[offer.type] || '');
}

function Countdown({ expiresAt }) {
    const { t, i18n } = useTranslation();
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

    useEffect(() => {
        if (!expiresAt) return;
        const update = () => {
            const diff = new Date(expiresAt) - new Date();
            if (diff <= 0) {
                setTimeLeft({ expired: true });
                return;
            }
            setTimeLeft({
                expired: false,
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000)
            });
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [expiresAt]);

    if (!expiresAt) return null;
    
    if (timeLeft.expired) {
        return (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {i18n.language === 'ar' ? 'انتهى العرض' : 'Offer Expired'}
            </div>
        );
    }

    const units = [
        { value: timeLeft.d, label: i18n.language === 'ar' ? 'يوم' : 'Days', show: timeLeft.d > 0 },
        { value: timeLeft.h, label: i18n.language === 'ar' ? 'ساعة' : 'Hours', show: true },
        { value: timeLeft.m, label: i18n.language === 'ar' ? 'دقيقة' : 'Mins', show: true },
        { value: timeLeft.s, label: i18n.language === 'ar' ? 'ثانية' : 'Secs', show: true },
    ].filter(u => u.show);

    return (
        <div className="flex items-center gap-2 md:gap-4 rtl:flex-row-reverse" dir="ltr">
            {units.map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-inner rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center relative overflow-hidden">
                        <span className="text-xl md:text-2xl font-black tabular-nums tracking-tight z-10">
                            {String(unit.value).padStart(2, '0')}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                    </div>
                    <span className="text-white/80 text-[10px] md:text-xs font-bold mt-1.5 uppercase tracking-wider">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function OfferDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const tr = useLocalize();
    const { addToCart, cartItems } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getOfferDetails(id);
                setOffer(res.data?.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            toast.error(i18n.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
            navigate('/login', { state: { from: `/offers/${offer.id}` } });
            return;
        }

        if (!offer?.products?.length) {
            // No specific products — go directly to checkout with offer applied
            navigate('/checkout', { state: { offer_id: offer.id, offer } });
            return;
        }

        setAdding(true);
        try {
            // Add each offer product to cart
            const qty = offer.type === 'buy_x_get_y' ? (offer.buy_quantity || 1) : 1;

            for (const product of offer.products) {
                await addToCart(product, qty);
            }

            // Navigate to checkout with offer_id in state
            navigate('/checkout', { state: { offer_id: offer.id, offer } });
        } catch (e) {
            console.error('Buy now error:', e);
            // Even if add-to-cart had an issue, still try to go to checkout
            navigate('/checkout', { state: { offer_id: offer.id, offer } });
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !offer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <AlertTriangle className="w-16 h-16 text-red-400" />
                <h2 className="text-xl font-bold text-gray-700">
                    {i18n.language === 'ar' ? 'العرض غير موجود أو انتهت صلاحيته' : 'Offer not found or expired'}
                </h2>
                <Link to="/offers" className="text-primary font-bold underline">
                    {i18n.language === 'ar' ? 'العودة للعروض' : 'Back to Offers'}
                </Link>
            </div>
        );
    }

    const config = TYPE_CONFIG[offer.type] || TYPE_CONFIG.fixed;
    const lang = i18n.language;

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 md:px-10 lg:px-40 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-primary transition-colors">{t('header.home')}</Link>
                    <span>/</span>
                    <Link to="/offers" className="hover:text-primary transition-colors">{t('offers.title')}</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">{tr(offer, 'name')}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left — Image */}
                    <div className="space-y-4">
                        <div className="relative rounded-3xl overflow-hidden aspect-square bg-gray-100 shadow-lg">
                            {offer.image ? (
                                <SafeImage
                                    src={`${import.meta.env.VITE_IMAGES_URL}/${offer.image}`}
                                    alt={tr(offer, 'name')}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                                    <Tag className="w-24 h-24 text-white/50" />
                                </div>
                            )}
                            {/* Type badge overlay */}
                            <div className="absolute top-4 start-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${config.badge}`}>
                                    {lang === 'ar' ? config.label : config.labelEn}
                                </span>
                            </div>
                        </div>

                        {/* Product thumbnails */}
                        {offer.products && offer.products.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {offer.products.slice(0, 4).map(p => (
                                    <div key={p.id} className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                                        <SafeImage
                                            src={`${import.meta.env.VITE_IMAGES_URL}/${p.image}`}
                                            alt={tr(p, 'name')}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                                {offer.products.length > 4 && (
                                    <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                                        +{offer.products.length - 4}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right — Details */}
                    <div className="flex flex-col gap-6">
                        {/* Title & description */}
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-3">{tr(offer, 'name')}</h1>
                            {tr(offer, 'description') && (
                                <p className="text-gray-600 leading-relaxed">{tr(offer, 'description')}</p>
                            )}
                        </div>

                        {/* Offer benefit card */}
                        <div className={`rounded-2xl p-5 bg-gradient-to-r ${config.color} text-white`}>
                            <p className="font-bold text-lg leading-relaxed">
                                {getOfferDescription(offer, lang)}
                            </p>
                        </div>

                        {/* Countdown */}
                        {offer.expires_at && (
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-6 shadow-lg shadow-orange-500/20">
                                {/* Background design elements */}
                                <div className="absolute -end-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute -start-10 -bottom-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 animate-pulse">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-lg">
                                                {lang === 'ar' ? 'ينتهي العرض قريباً!' : 'Offer ends soon!'}
                                            </p>
                                            <p className="text-white/80 text-sm font-medium">
                                                {lang === 'ar' ? 'سارع بالطلب قبل نفاذ الكمية' : 'Hurry up before stock runs out'}
                                            </p>
                                        </div>
                                    </div>
                                    <Countdown expiresAt={offer.expires_at} />
                                </div>
                            </div>
                        )}
                        
                        {/* Bundle Price Summary */}
                        {offer.type === 'bundle' && offer.products?.length > 0 && (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                                {(() => {
                                    const basePrice = offer.products.reduce((acc, p) => acc + parseFloat(p.discount_price || p.price || 0), 0);
                                    const finalPrice = parseFloat(offer.bundle_price);
                                    const discountValue = basePrice - finalPrice;
                                    
                                    return (
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                                                <Tag className="w-5 h-5 text-blue-500" />
                                                {lang === 'ar' ? 'ملخص سعر الباقة' : 'Bundle Price Summary'}
                                            </h3>
                                            
                                            <div className="flex justify-between text-gray-500 line-through decoration-red-400 opacity-80 text-sm">
                                                <span>{lang === 'ar' ? 'السعر الأصلي للمنتجات' : 'Original Products Price'}</span>
                                                <span>EGP {basePrice.toFixed(2)}</span>
                                            </div>
                                            
                                            <div className="flex justify-between text-green-600 font-bold text-sm bg-green-100/50 p-2 rounded-lg">
                                                <span>{lang === 'ar' ? 'قيمة التوفير (خصم)' : 'You Save (Discount)'}</span>
                                                <span>-EGP {Math.max(0, discountValue).toFixed(2)}</span>
                                            </div>
                                            
                                            <div className="flex justify-between font-black text-2xl text-blue-700 pt-3 border-t border-blue-200/60 mt-2">
                                                <span>{lang === 'ar' ? 'سعر الباقة الإجمالي' : 'Total Bundle Price'}</span>
                                                <span>EGP {finalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Included products */}
                        {offer.products && offer.products.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    {lang === 'ar' ? `المنتجات المشمولة (${offer.products.length})` : `Included Products (${offer.products.length})`}
                                </h3>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {offer.products.map(product => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className="flex items-center gap-3 bg-white p-3 rounded-xl hover:shadow-sm transition-all border border-gray-100 group"
                                        >
                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                                                <SafeImage
                                                    src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
                                                    alt={tr(product, 'name')}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-primary transition-colors">
                                                    {tr(product, 'name')}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {product.discount_price > 0
                                                        ? `EGP ${product.discount_price}`
                                                        : `EGP ${product.price}`}
                                                </p>
                                            </div>
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Buy Now */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleBuyNow}
                                disabled={adding}
                                className="flex-1 py-4 bg-secondary text-white font-black text-lg rounded-2xl hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {adding ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <ShoppingBag className="w-5 h-5" />
                                )}
                                {lang === 'ar' ? 'اشترِ الآن بالعرض' : 'Buy Now with Offer'}
                            </button>
                            <Link
                                to="/offers"
                                className="px-6 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                                {lang === 'ar' ? 'العروض الأخرى' : 'Other Offers'}
                            </Link>
                        </div>

                        {/* Note about coupon stacking */}
                        <p className="text-xs text-gray-400 text-center">
                            {lang === 'ar'
                                ? '* لا يمكن تطبيق كود خصم مع هذا العرض في نفس الوقت'
                                : '* Coupon codes cannot be combined with this offer'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
