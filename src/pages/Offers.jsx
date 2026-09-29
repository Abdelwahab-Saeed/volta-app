import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Package, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { getOffers } from '@/api/offers.api';
import SafeImage from '@/components/common/SafeImage';
import { OFFER_BADGE, formatPrice, imageUrl, useCountdown, shortCountdownLabel } from '@/components/offers/offerUtils';
import OfferPlaceholder from '@/components/offers/OfferPlaceholder';

function Countdown({ expiresAt }) {
    const { t } = useTranslation();
    const timeLeft = useCountdown(expiresAt, 60000);
    const label = shortCountdownLabel(timeLeft, t);
    if (!label) return null;
    return (
        <div className="flex items-center gap-1 text-secondary text-xs font-bold">
            <Clock className="w-3 h-3" />
            <span>{label}</span>
        </div>
    );
}

function OfferCard({ offer }) {
    const { t } = useTranslation();
    const { display } = offer;

    return (
        <Link
            to={`/offers/${offer.id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col"
        >
            {/* Image */}
            <div className="relative overflow-hidden h-48">
                {offer.image ? (
                    <SafeImage
                        src={imageUrl(offer.image)}
                        alt={offer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <OfferPlaceholder />
                )}
                {/* Type badge */}
                <div className="absolute top-3 start-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${OFFER_BADGE}`}>
                        {display.type_label}
                    </span>
                </div>
                {/* Products count */}
                {offer.products?.length > 0 && (
                    <div className="absolute top-3 end-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1" title={t('offers.products_count', { count: offer.products.length })}>
                        <Package className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-bold text-gray-700">{offer.products.length}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{offer.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">{display.summary}</p>

                {/* Prices (null when the customer picks a product first: each product has its own price) */}
                {display.offer_price !== null && (
                    <div className="flex items-baseline gap-2 mb-3" dir="ltr">
                        <span className="text-lg font-black text-primary">{formatPrice(display.offer_price)}</span>
                        {display.savings > 0 && (
                            <span className="text-sm text-gray-400 line-through">{formatPrice(display.regular_price)}</span>
                        )}
                    </div>
                )}
                {!offer.purchase.available && (
                    <p className="text-xs font-bold text-red-500 mb-3">{offer.purchase.unavailable_reason || t('offers.unavailable')}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <Countdown expiresAt={offer.expires_at} />
                    <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all ms-auto">
                        {t('offers.view_offer')}
                        <ArrowLeft className="w-4 h-4 ltr:rotate-180" />
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
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const loadOffers = useCallback(async (p = 1) => {
        setLoading(true);
        setError(false);
        try {
            const res = await getOffers(p);
            const data = res.data?.data;
            if (data) {
                setOffers(prev => p === 1 ? data.data : [...prev, ...data.data]);
                setLastPage(data.last_page);
                setTotal(data.total);
                setPage(p);
            }
        } catch (e) {
            console.error(e);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // Offer texts come localized from the API, so reload from page 1 when the language changes.
    useEffect(() => { loadOffers(1); }, [loadOffers, i18n.language]);

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
                    <p className="text-white/80 text-lg">{t('offers.subtitle')}</p>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-10 lg:px-20 py-12">
                {loading && offers.length === 0 ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : error && offers.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-500 mb-4">{t('offers.load_error')}</p>
                        <button onClick={() => loadOffers(1)} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">
                            {t('offers.retry')}
                        </button>
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-24">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-500">{t('offers.none')}</h2>
                        <p className="text-gray-400 mt-2">{t('offers.none_hint')}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {t('offers.available_offers')}
                                <span className="ms-2 text-lg font-normal text-gray-400">({total})</span>
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
                                    {t('offers.load_more')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
