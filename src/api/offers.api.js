import api from './axios';

export const getOffers = (page = 1) => api.get(`/offers?page=${page}`);
export const getAllOffers = () => api.get('/offers/all');
export const getOfferDetails = (id) => api.get(`/offers/${id}`);
