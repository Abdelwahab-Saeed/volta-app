import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Tag, Package, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { getOffers } from '@/api/offers.api';
import { useLocalize } from '@/lib/localize';
import SafeImage from '@/components/common/SafeImage';

const TYPE_CONFIG = {
    percentage:    { label: 'نسبة خصم', labelEn: 'Discount %',   color: 'from-purple-500 to-purple-700',  badge: 'bg-purple-100 text-purple-700' },
    fixed:         { label: 'خصم ثابت', labelEn: 'Fixed Off',     color: 'from-blue-500 to-blue-700',      badge: 'bg-blue-100 text-blue-700' },
    bundle:        { label: 'باقة',      labelEn: 'Bundle Deal',   color: 'from-orange-500 to-orange-700',  badge: 'bg-orange-100 text-orange-700' },
    buy_x_get_y:   { label: 'اشترِ X',  labelEn: 'Buy X Get Y',   color: 'from-green-500 to-green-700',    badge: 'bg-green-100 text-green-700' },
    spend_x_get_y: { label: 'اصرف X',   labelEn: 'Spend & Save',  color: 'from-pink-500 to-pink-700',      badge: 'bg-pink-100 text-pink-700' },
};

function getOfferSummary(offer, lang) {
    switch (offer.type) {
        case 'percentage':
            return lang === 'ar' ? `خصم ${offer.value}% على المنتجات المختارة` : `${offer.value}% off on selected products`;
        case 'fixed':
            return lang === 'ar' ? `خصم ${offer.value} ج.م على المنتجات المختارة` : `EGP ${offer.value} off selected products`;
        case 'bundle':
            return lang === 'ar' ? `اشترِ الباقة كاملة بسعر ${offer.bundle_price} ج.م` : `Get the full bundle for EGP ${offer.bundle_price}`;
        case 'buy_x_get_y':
            return lang === 'ar'
                ? `اشترِ ${offer.buy_quantity} واحصل على ${offer.get_quantity} مجاناً`
                : `Buy ${offer.buy_quantity} get ${offer.get_quantity} free`;
        case 'spend_x_get_y':
            return lang === 'ar'
                ? `اصرف ${offer.min_spend} ج.م واحصل على خصم ${offer.discount_amount} ج.م`
                : `Spend EGP ${offer.min_spend} get EGP ${offer.discount_amount} off`;
        default:
            return '';
    }
}

function Countdown({ expiresAt }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!expiresAt) return;
        const update = () => {
            const diff = new Date(expiresAt) - new Date();
            if (diff <= 0) { setTimeLeft('انتهى العرض'); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setTimeLeft(d > 0 ? `${d}ي ${h}س ${m}د` : `${h}س ${m}د`);
        };
        update();
        const timer = setInterval(update, 60000);
        return () => clearInterval(timer);
    }, [expiresAt]);

    if (!expiresAt || !timeLeft) return null;
    return (
        <div className="flex items-center gap-1 text-orange-600 text-xs font-bold">
            <Clock className="w-3 h-3" />
            <span>{timeLeft}</span>
        </div>
    );
}

function OfferCard({ offer }) {
    const { i18n } = useTranslation();
    const tr = useLocalize();
    const config = TYPE_CONFIG[offer.type] || TYPE_CONFIG.fixed;

    return (
        <Link
            to={`/offers/${offer.id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col"
        >
            {/* Image */}
            <div className="relative overflow-hidden h-48">
                {offer.image ? (
                    <SafeImage
                        src={`${import.meta.env.VITE_IMAGES_URL}/${offer.image}`}
                        alt={tr(offer, 'name')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                        <Tag className="w-16 h-16 text-white/60" />
                    </div>
                )}
                {/* Type badge */}
                <div className="absolute top-3 start-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.badge} backdrop-blur-sm`}>
                        {i18n.language === 'ar' ? config.label : config.labelEn}
                    </span>
                </div>
                {/* Products count */}
                {offer.products && offer.products.length > 0 && (
                    <div className="absolute top-3 end-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Package className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-bold text-gray-700">{offer.products.length}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                    {tr(offer, 'name')}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
                    {getOfferSummary(offer, i18n.language)}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <Countdown expiresAt={offer.expires_at} />
                    <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        {i18n.language === 'ar' ? 'عرض التفاصيل' : 'View Offer'}
                        <ArrowLeft className="w-4 h-4 rotate-180 rtl:rotate-0" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function Offers() {
    const { t, i18n } = useTranslation();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const loadOffers = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await getOffers(p);
            const data = res.data?.data;
            if (data) {
                setOffers(prev => p === 1 ? data.data : [...prev, ...data.data]);
                setLastPage(data.last_page);
                setPage(p);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadOffers(1); }, [loadOffers]);

    return (
        <>
            {/* Hero */}
            <div className="bg-gradient-to-r from-primary to-secondary px-4 md:px-10 lg:px-40 py-12">
                <div className="text-white">
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                        <Link to="/" className="hover:text-white transition-colors">{t('header.home')}</Link>
                        <span>/</span>
                        <span className="text-white">{t('offers.title')}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3">{t('offers.title')}</h1>
                    <p className="text-white/80 text-lg">
                        {i18n.language === 'ar' ? 'اكتشف أفضل العروض والخصومات الحصرية' : 'Discover the best exclusive deals and discounts'}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-10 lg:px-20 py-12">
                {loading && offers.length === 0 ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-24">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-500">
                            {i18n.language === 'ar' ? 'لا توجد عروض متاحة حالياً' : 'No active offers at the moment'}
                        </h2>
                        <p className="text-gray-400 mt-2">
                            {i18n.language === 'ar' ? 'تابعنا لاحقاً للاطلاع على أفضل العروض' : 'Check back later for amazing deals'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {i18n.language === 'ar' ? 'العروض المتاحة' : t('offers.available_offers')}
                                <span className="mr-2 text-lg font-normal text-gray-400">({offers.length})</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {offers.map(offer => (
                                <OfferCard key={offer.id} offer={offer} />
                            ))}
                        </div>

                        {/* Load more */}
                        {page < lastPage && (
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={() => loadOffers(page + 1)}
                                    disabled={loading}
                                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {i18n.language === 'ar' ? 'تحميل المزيد' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}