import { useEffect, useState } from 'react';
import i18n from '@/i18n';

// Offer texts (type label, summary, unavailable reason) and prices come from the API already localized,
// and every offer uses the brand colours (navy primary, blue secondary), whatever its type.

// Type badge over an image or the navy placeholder.
export const OFFER_BADGE = 'bg-white/95 text-primary border border-white shadow-sm';

// "1,250 EGP" / "249.5 ج.م" (amount first, currency in the current language)
export const formatPrice = (value, currency = i18n.t('common.currency')) =>
    `${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${currency}`;

export const imageUrl = (path) => (path ? `${import.meta.env.VITE_IMAGES_URL}/${path}` : null);

/**
 * Time left until expiresAt, refreshed every `intervalMs`. Null when the offer has no end date.
 */
export function useCountdown(expiresAt, intervalMs = 1000) {
    const compute = () => {
        const diff = new Date(expiresAt) - new Date();
        if (diff <= 0) return { expired: true, d: 0, h: 0, m: 0, s: 0 };
        return {
            expired: false,
            d: Math.floor(diff / 86400000),
            h: Math.floor((diff % 86400000) / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
        };
    };

    const [timeLeft, setTimeLeft] = useState(() => (expiresAt ? compute() : null));

    useEffect(() => {
        if (!expiresAt) {
            setTimeLeft(null);
            return;
        }
        setTimeLeft(compute());
        const timer = setInterval(() => setTimeLeft(compute()), intervalMs);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expiresAt, intervalMs]);

    return timeLeft;
}

/**
 * Short "2d 5h" / "5h 30m" label for cards, using the offers.*_short translations.
 */
export function shortCountdownLabel(timeLeft, t) {
    if (!timeLeft) return '';
    if (timeLeft.expired) return t('offers.ended');
    return timeLeft.d > 0
        ? `${timeLeft.d}${t('offers.days_short')} ${timeLeft.h}${t('offers.hours_short')}`
        : `${timeLeft.h}${t('offers.hours_short')} ${timeLeft.m}${t('offers.minutes_short')}`;
}
