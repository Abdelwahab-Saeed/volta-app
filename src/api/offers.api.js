import api from './axios';

// Offers come display-ready from the API (localized texts, prices from the same code checkout charges with):
// render offer.display / offer.purchase, never compute offer prices here.
export const getOffers = (page = 1) => api.get(`/offers?page=${page}`);
export const getAllOffers = () => api.get('/offers/all');
export const getOfferDetails = (id) => api.get(`/offers/${id}`);

// What buying the offer costs right now. `sets` = how many times, `productId` = the chosen product when the offer asks for one.
export const getOfferQuote = (id, { sets = 1, productId = null } = {}) =>
    api.get(`/offers/${id}/quote`, { params: { sets, ...(productId ? { product_id: productId } : {}) } });

// Buy an offer directly (never through the cart). expected_total = the quote total the customer saw;
// the idempotency key makes a retried/double-submitted request return the same order instead of a second one.
export const checkoutOffer = (data, idempotencyKey) =>
    api.post('/checkout/offer', data, { headers: { 'Idempotency-Key': idempotencyKey } });
