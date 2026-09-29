import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Gift, AlertTriangle } from "lucide-react";

import { getOfferQuote, checkoutOffer } from "@/api/offers.api";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/common/SafeImage";
import DeliveryFields from "@/components/checkout/DeliveryFields";
import { useDeliveryForm } from "@/components/checkout/useDeliveryForm";
import { formatPrice, imageUrl } from "@/components/offers/offerUtils";
import { trackEvent } from "@/lib/pixel";

import logo from '../assets/volta-logo-02.png';

const newKey = () =>
    (window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/**
 * One idempotency key per checkout attempt, kept in sessionStorage so a refresh after a timed-out submit
 * reuses it (the server then returns the order it already created instead of making a second one).
 */
function useIdempotencyKey(scope) {
    const storageKey = `offer-checkout:${scope}`;
    const [key] = useState(() => {
        try {
            const existing = sessionStorage.getItem(storageKey);
            if (existing) return existing;
            const created = newKey();
            sessionStorage.setItem(storageKey, created);
            return created;
        } catch {
            return newKey();
        }
    });
    const clear = () => { try { sessionStorage.removeItem(storageKey); } catch { /* storage unavailable */ } };
    return [key, clear];
}

/**
 * Buying an offer: /checkout/offer/:id?sets=2&product_id=5. Everything the order needs is in the URL,
 * so refresh/back work; the cart is never read or cleared, and no coupon can be added.
 */
export default function OfferCheckout() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuthStore();

    const sets = Math.max(parseInt(searchParams.get('sets'), 10) || 1, 1);
    const productId = searchParams.get('product_id') ? Number(searchParams.get('product_id')) : null;
    const backToOffer = `/offers/${id}?${searchParams}`;

    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [priceChanged, setPriceChanged] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [idempotencyKey, clearIdempotencyKey] = useIdempotencyKey(`${id}:${sets}:${productId ?? ''}`);

    const { register, handleSubmit, formState: { errors }, setValue } = useDeliveryForm();

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setLoadError(null);
        getOfferQuote(id, { sets, productId })
            .then(res => { if (!cancelled) setQuote(res.data?.data); })
            .catch(err => { if (!cancelled) setLoadError(err.response?.data?.message || t('offers.not_found')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [id, sets, productId, i18n.language, t]);

    const onSubmit = async (data) => {
        if (!quote?.purchasable || submitting) return;
        setSubmitting(true);
        try {
            const response = await checkoutOffer({
                ...data,
                offer_id: Number(id),
                sets,
                product_id: productId,
                expected_total: quote.total,
            }, idempotencyKey);

            const order = response.data?.data;
            clearIdempotencyKey();
            trackEvent('Purchase', {
                content_ids: quote.items.map(item => String(item.product_id)),
                content_type: 'product',
                value: order?.total_amount ?? quote.total,
                currency: 'EGP'
            }, { eventID: String(order?.id) });

            toast.success(t('offers.order_placed'));
            // replace: going back must not land on a checkout for an order that already exists
            navigate(isAuthenticated ? '/orders' : '/', { replace: true });
        } catch (error) {
            const body = error.response?.data;
            if (error.response?.status === 409 && body?.errors?.quote) {
                // Prices changed since the customer saw them: show the new total and let them confirm.
                setQuote(body.errors.quote);
                setPriceChanged(true);
                toast.warning(body.message);
            } else {
                if (body?.errors?.quote) setQuote(body.errors.quote);
                toast.error(body?.message || t('common.error'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !quote) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (loadError || !quote) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <AlertTriangle className="w-16 h-16 text-red-400" />
                <h2 className="text-xl font-bold text-gray-700">{loadError || t('offers.not_found')}</h2>
                <Link to="/offers" className="text-primary font-bold underline">{t('offers.back_to_offers')}</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Delivery form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-6">
                                <div className="border-b border-gray-300 pb-6 mb-4">
                                    <SafeImage src={logo} alt="VOLTA" className="h-15" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 text-start">{t('offers.checkout_title')}</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <DeliveryFields register={register} errors={errors} setValue={setValue} />

                                <div className="flex gap-4 justify-between items-center pt-4">
                                    <Link to={backToOffer} className="text-sm text-primary underline">
                                        {t('offers.back_to_offer')}
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={submitting || loading || !quote.purchasable}
                                        className="px-5 py-7 bg-secondary rounded-xl hover:bg-[#0090c7] text-white text-lg disabled:opacity-50 min-w-[200px]"
                                    >
                                        {submitting ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>{t('checkout.processing')}</span>
                                            </div>
                                        ) : (
                                            t('checkout.place_order')
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Offer summary (all numbers from the server quote) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-start">{t('offers.summary')}</h3>

                            {priceChanged && (
                                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                                    {t('offers.price_changed')}
                                </div>
                            )}
                            {!quote.purchasable && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {quote.issues?.[0]?.message || t('offers.unavailable')}
                                </div>
                            )}

                            <div className="space-y-4 mb-6">
                                {quote.items.map(item => (
                                    <div key={item.product_id} className="flex items-center gap-3 pb-4 border-b">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                                            <SafeImage src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <p className="font-medium text-gray-800 line-clamp-2">{item.name}</p>
                                            <p className="text-sm text-gray-600 mt-1" dir="ltr">{item.quantity} × {formatPrice(item.unit_price)}</p>
                                        </div>
                                    </div>
                                ))}
                                {quote.gifts.map(gift => (
                                    <div key={gift.product_id} className="flex items-center gap-3 pb-4 border-b">
                                        <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                                            {gift.image
                                                ? <SafeImage src={imageUrl(gift.image)} alt={gift.name} className="w-full h-full object-contain" />
                                                : <Gift className="w-6 h-6 text-green-600" />}
                                        </div>
                                        <div className="flex-1 text-start">
                                            <p className="font-medium text-gray-800 line-clamp-2">{gift.name}</p>
                                            <p className="text-sm text-green-600 font-bold mt-1">{gift.quantity} × {t('offers.gift')} — {t('offers.free')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`space-y-3 pt-4 border-t transition-opacity ${loading ? 'opacity-50' : ''}`}>
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-start">{t('offers.subtotal')}</span>
                                    <span dir="ltr">{formatPrice(quote.subtotal)}</span>
                                </div>
                                {quote.discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span className="text-start">{t('offers.discount')}</span>
                                        <span dir="ltr">-{formatPrice(quote.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-start">{t('checkout.shipping_fee')}</span>
                                    <span dir="ltr">{formatPrice(quote.shipping_cost)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                                    <span className="text-start">{t('offers.total')}</span>
                                    <span dir="ltr">{formatPrice(quote.total)}</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 text-center mt-4">{t('offers.no_coupon_note')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
