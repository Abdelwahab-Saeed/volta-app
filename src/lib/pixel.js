/** Record a page view. */
export const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
    }
};

/** Record a standard Meta event, e.g. trackEvent('AddToCart', { value, currency }, { eventID: '123' }). */
export const trackEvent = (event, data, options = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', event, data, options);
    }
};

