import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Clock, Tag, Package, ShoppingBag, ArrowLeft, Loader2,
    AlertTriangle, Gift, Minus, Plus
} from 'lucide-react';
import { getOfferDetails, getOfferQuote } from '@/api/offers.api';
import SafeImage from '@/components/common/SafeImage';
import { OFFER_BADGE, formatPrice, imageUrl, useCountdown } from '@/components/offers/offerUtils';
import OfferPlaceholder from '@/components/offers/OfferPlaceholder';

function Countdown({ expiresAt }) {
    const { t } = useTranslation();
    const timeLeft = useCountdown(expiresAt);

    if (!timeLeft) return null;

    if (timeLeft.expired) {
        return (
            <div className="bg-white/90 text-red-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {t('offers.ended')}
            </div>
        );
    }

    const units = [
        { value: timeLeft.d, label: t('offers.days'), show: timeLeft.d > 0 },
        { value: timeLeft.h, label: t('offers.hours'), show: true },
        { value: timeLeft.m, label: t('offers.minutes'), show: true },
        { value: timeLeft.s, label: t('offers.seconds'), show: true },
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

/**
 * Offer page. What the customer picks (how many times, which product) lives in the URL
 * (?sets=2&product_id=5), so back/forward, refresh and shared links keep it. Prices come from the API quote.
 * "Buy" goes to the offer checkout; the cart is never touched.
 */
export default function OfferDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t, i18n } = useTranslation();

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [quote, setQuote] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(false);

    const maxSets = offer?.purchase.max_sets || 20;
    const sets = Math.min(Math.max(parseInt(searchParams.get('sets'), 10) || 1, 1), maxSets);
    const productId = searchParams.get('product_id') ? Number(searchParams.get('product_id')) : null;
    const requiresChoice = !!offer?.purchase.requires_product_choice;

    const updateSelection = (changes) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
        setSearchParams(next, { replace: true });
    };

    // Offer texts are localized by the API, so refetch when the language changes.
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setNotFound(false);
        getOfferDetails(id)
            .then(res => { if (!cancelled) setOffer(res.data?.data); })
            .catch(() => { if (!cancelled) setNotFound(true); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [id, i18n.language]);

    // Offers with several products: preselect the first buyable one (or keep a valid choice from the URL).
    useEffect(() => {
        if (!offer || !requiresChoice) return;
        const valid = offer.products.some(p => p.id === productId);
        if (!valid) {
            const first = offer.products.find(p => p.offer?.available) || offer.products[0];
            if (first) updateSelection({ product_id: first.id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offer, requiresChoice, productId]);

    // Price for the current selection.
    useEffect(() => {
        if (!offer || (requiresChoice && !productId)) return;
        let cancelled = false;
        setQuoteLoading(true);
        getOfferQuote(id, { sets, productId: requiresChoice ? productId : null })
            .then(res => { if (!cancelled) setQuote(res.data?.data); })
            .catch(() => { if (!cancelled) setQuote(null); })
            .finally(() => { if (!cancelled) setQuoteLoading(false); });
        return () => { cancelled = true; };
    }, [id, offer, sets, productId, requiresChoice, i18n.language]);

    const handleBuyNow = () => {
        const params = new URLSearchParams({ sets: String(sets) });
        if (requiresChoice && productId) params.set('product_id', String(productId));
        navigate(`/checkout/offer/${id}?${params}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (notFound || !offer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <AlertTriangle className="w-16 h-16 text-red-400" />
                <h2 className="text-xl font-bold text-gray-700">{t('offers.not_found')}</h2>
                <Link to="/offers" className="text-primary font-bold underline">{t('offers.back_to_offers')}</Link>
            </div>
        );
    }

    const canBuy = offer.purchase.available && quote?.purchasable && !quoteLoading;
    const unavailableReason = !offer.purchase.available
        ? offer.purchase.unavailable_reason
        : (quote && !quote.purchasable ? quote.issues?.[0]?.message : null);

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 md:px-10 lg:px-40 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-primary transition-colors">{t('header.home')}</Link>
                    <span>/</span>
                    <Link to="/offers" className="hover:text-primary transition-colors">{t('offers.title')}</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">{offer.name}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Image */}
                    <div className="space-y-4">
                        <div className="relative rounded-3xl overflow-hidden aspect-square bg-gray-100 shadow-lg">
                            {offer.image ? (
                                <SafeImage src={imageUrl(offer.image)} alt={offer.name} className="w-full h-full object-cover" />
                            ) : (
                                <OfferPlaceholder />
                            )}
                            <div className="absolute top-4 start-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${OFFER_BADGE}`}>
                                    {offer.display.type_label}
                                </span>
                            </div>
                        </div>

                        {/* Product thumbnails */}
                        {offer.products.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {offer.products.slice(0, 4).map(p => (
                                    <div key={p.id} className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                                        <SafeImage src={imageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
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

                    {/* Details */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-3">{offer.name}</h1>
                            {offer.description && <p className="text-gray-600 leading-relaxed">{offer.description}</p>}
                        </div>

                        {/* What the offer gives (text from the API) */}
                        <div className="rounded-2xl p-5 bg-gradient-to-r from-primary to-secondary text-white">
                            <p className="font-bold text-lg leading-relaxed">{offer.display.summary}</p>
                        </div>

                        {/* Countdown */}
                        {offer.expires_at && (
                            <div className="relative overflow-hidden rounded-2xl bg-primary p-6 shadow-lg shadow-primary/20">
                                <div className="absolute -end-10 -top-10 w-40 h-40 bg-secondary-on-dark/25 rounded-full blur-2xl"></div>
                                <div className="absolute -start-10 -bottom-10 w-32 h-32 bg-secondary/25 rounded-full blur-2xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 animate-pulse">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-lg">{t('offers.ends_soon')}</p>
                                            <p className="text-white/80 text-sm font-medium">{t('offers.hurry')}</p>
                                        </div>
                                    </div>
                                    <Countdown expiresAt={offer.expires_at} />
                                </div>
                            </div>
                        )}

                        {/* Product choice (offers with several eligible products) */}
                        {requiresChoice && (
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    {t('offers.choose_product')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {offer.products.map(product => {
                                        const selected = product.id === productId;
                                        const buyable = product.offer?.available;
                                        return (
                                            <button
                                                key={product.id}
                                                type="button"
                                                disabled={!buyable}
                                                onClick={() => updateSelection({ product_id: product.id })}
                                                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-start transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selected ? 'border-secondary bg-secondary/5' : 'border-gray-100 bg-white hover:border-secondary/50'}`}
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                                                    <SafeImage src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                                                    {product.offer && (
                                                        <p className="text-xs mt-0.5" dir="ltr">
                                                            <span className="font-bold text-primary">{formatPrice(product.offer.offer_price)}</span>
                                                            {product.offer.savings > 0 && (
                                                                <span className="text-gray-400 line-through ms-2">{formatPrice(product.offer.regular_price)}</span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* How many times */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-5">
                            <span className="font-bold text-gray-800">{t('offers.sets')}</span>
                            <div className="flex items-center border border-gray-300 rounded-xl h-11 overflow-hidden bg-white">
                                <button
                                    type="button"
                                    onClick={() => updateSelection({ sets: sets - 1 > 1 ? sets - 1 : null })}
                                    disabled={sets <= 1}
                                    aria-label={t('a11y.decrease_quantity')}
                                    className="px-3 h-full hover:bg-gray-100 disabled:opacity-40"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold tabular-nums">{sets}</span>
                                <button
                                    type="button"
                                    onClick={() => updateSelection({ sets: sets + 1 })}
                                    disabled={sets >= maxSets}
                                    aria-label={t('a11y.increase_quantity')}
                                    className="px-3 h-full hover:bg-gray-100 disabled:opacity-40"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* What the customer gets and pays (from the quote) */}
                        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 space-y-3">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                                <Tag className="w-5 h-5 text-secondary" />
                                {t('offers.includes')}
                            </h3>

                            {quoteLoading && !quote ? (
                                <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                            ) : quote ? (
                                <div className={`space-y-3 transition-opacity ${quoteLoading ? 'opacity-50' : ''}`}>
                                    {quote.items.map(item => (
                                        <div key={item.product_id} className="flex justify-between text-sm text-gray-700">
                                            <span>{item.quantity} × {item.name}</span>
                                            <span dir="ltr">{formatPrice(item.total)}</span>
                                        </div>
                                    ))}
                                    {quote.gifts.map(gift => (
                                        <div key={gift.product_id} className="flex justify-between text-sm text-green-700 font-bold">
                                            <span className="flex items-center gap-1"><Gift className="w-4 h-4" />{gift.quantity} × {gift.name}</span>
                                            <span>{t('offers.free')}</span>
                                        </div>
                                    ))}
                                    {quote.discount > 0 && (
                                        <div className="flex justify-between text-green-600 font-bold text-sm bg-green-100/50 p-2 rounded-lg">
                                            <span>{t('offers.you_save')}</span>
                                            <span dir="ltr">-{formatPrice(quote.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-black text-2xl text-primary pt-3 border-t border-secondary/20">
                                        <span>{t('offers.offer_price')}</span>
                                        <span dir="ltr">{formatPrice(quote.subtotal - quote.discount)}</span>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {unavailableReason && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                {unavailableReason}
                            </div>
                        )}

                        {/* Buy Now */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleBuyNow}
                                disabled={!canBuy}
                                className="flex-1 py-4 bg-secondary text-white font-black text-lg rounded-2xl hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {t('offers.buy_now')}
                            </button>
                            <Link
                                to="/offers"
                                className="px-6 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                                {t('offers.other_offers')}
                            </Link>
                        </div>

                        <p className="text-xs text-gray-400 text-center">{t('offers.no_coupon_note')}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
