import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tag, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { getAllOffers } from '@/api/offers.api';
import { useLocalize } from '@/lib/localize';
import SafeImage from '@/components/common/SafeImage';

const TYPE_CONFIG = {
    percentage:    { color: 'from-purple-500 to-purple-700', badge: 'bg-purple-100 text-purple-700', label: 'خصم %', labelEn: '% Off' },
    fixed:         { color: 'from-blue-500 to-blue-700',     badge: 'bg-blue-100 text-blue-700',     label: 'خصم ثابت', labelEn: 'Fixed Off' },
    bundle:        { color: 'from-orange-500 to-orange-700', badge: 'bg-orange-100 text-orange-700', label: 'باقة', labelEn: 'Bundle' },
    buy_x_get_y:   { color: 'from-green-500 to-green-700',  badge: 'bg-green-100 text-green-700',   label: 'اشترِ X', labelEn: 'Buy X Get Y' },
    spend_x_get_y: { color: 'from-pink-500 to-pink-700',    badge: 'bg-pink-100 text-pink-700',     label: 'اصرف X', labelEn: 'Spend & Save' },
};

function getOfferSummary(offer, lang) {
    const ar = {
        percentage:    `خصم ${offer.value}% على المنتجات المختارة`,
        fixed:         `خصم ${offer.value} ج.م على المنتجات المختارة`,
        bundle:        `باقة كاملة بسعر ${offer.bundle_price} ج.م`,
        buy_x_get_y:   `اشترِ ${offer.buy_quantity} احصل على ${offer.get_quantity} مجاناً`,
        spend_x_get_y: `اصرف ${offer.min_spend} ج.م احصل على خصم ${offer.discount_amount} ج.م`,
    };
    const en = {
        percentage:    `${offer.value}% off on selected products`,
        fixed:         `EGP ${offer.value} off selected products`,
        bundle:        `Full bundle for EGP ${offer.bundle_price}`,
        buy_x_get_y:   `Buy ${offer.buy_quantity} get ${offer.get_quantity} free`,
        spend_x_get_y: `Spend EGP ${offer.min_spend} get EGP ${offer.discount_amount} off`,
    };
    return lang === 'ar' ? (ar[offer.type] || '') : (en[offer.type] || '');
}

function Countdown({ expiresAt }) {
    const [label, setLabel] = useState('');
    useEffect(() => {
        if (!expiresAt) return;
        const update = () => {
            const diff = new Date(expiresAt) - new Date();
            if (diff <= 0) { setLabel('انتهى'); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setLabel(d > 0 ? `${d}ي ${h}س` : `${h}س ${m}د`);
        };
        update();
        const t = setInterval(update, 60000);
        return () => clearInterval(t);
    }, [expiresAt]);
    if (!label) return null;
    return (
        <span className="flex items-center gap-1 text-orange-500 text-xs font-bold">
            <Clock className="w-3 h-3" />{label}
        </span>
    );
}

export default function HomeOffersSection() {
    const { t, i18n } = useTranslation();
    const tr = useLocalize();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOffers()
            .then(res => setOffers(res.data?.data?.slice(0, 4) || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (!loading && offers.length === 0) return null;

    return (
        <section className="py-10">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-primary">
                        {t('header.offers') || 'العروض الحصرية'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {i18n.language === 'ar' ? 'أفضل الخصومات والعروض الخاصة' : 'Best deals and exclusive discounts'}
                    </p>
                </div>
                <Link
                    to="/offers"
                    className="flex items-center gap-1.5 text-sm font-bold text-secondary hover:underline"
                >
                    {i18n.language === 'ar' ? 'كل العروض' : 'View all'}
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {offers.map(offer => {
                        const config = TYPE_CONFIG[offer.type] || TYPE_CONFIG.fixed;
                        return (
                            <Link
                                key={offer.id}
                                to={`/offers/${offer.id}`}
                                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[180px] flex flex-col"
                            >
                                {/* Background */}
                                {offer.image ? (
                                    <SafeImage
                                        src={`${import.meta.env.VITE_IMAGES_URL}/${offer.image}`}
                                        alt={tr(offer, 'name')}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${config.color}`} />
                                )}

                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                                {/* Content */}
                                <div className="relative z-10 flex flex-col h-full p-4">
                                    <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold ${config.badge} mb-auto`}>
                                        {i18n.language === 'ar' ? config.label : config.labelEn}
                                    </span>

                                    <div className="mt-auto">
                                        <h3 className="text-white font-black text-base leading-tight mb-1 line-clamp-2">
                                            {tr(offer, 'name')}
                                        </h3>
                                        <p className="text-white/80 text-xs mb-2 line-clamp-1">
                                            {getOfferSummary(offer, i18n.language)}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <Countdown expiresAt={offer.expires_at} />
                                            <span className="text-white text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                                {i18n.language === 'ar' ? 'اكتشف ←' : 'Explore →'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
