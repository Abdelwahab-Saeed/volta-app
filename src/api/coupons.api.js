import api from './axios';

export const applyCoupon = (data) =>
    api.post('/coupons/apply', data); // data: { code, cart_total }
