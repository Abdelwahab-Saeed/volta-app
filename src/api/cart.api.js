import api from './axios';

export const getCart = () =>
    api.get('/cart');

export const addToCart = (data) =>
    api.post('/cart', data); // data: { product_id, quantity }

export const updateCart = (id, data) =>
    api.put(`/cart/${id}`, data); // data: { quantity }



export const removeFromCart = (id) =>
    api.delete(`/cart/${id}`);

export const clearCart = () =>
    api.delete('/cart/clear'); // Optional: Function to clear entire cart if backend supports it
