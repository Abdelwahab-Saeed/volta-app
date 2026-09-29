import api from './axios';

export const getCart = () =>
    api.get('/cart');

export const addToCart = (data) =>
    api.post('/cart', data); // data: { product_id, quantity }

export const updateCart = (id, data) =>
    api.put(`/cart/${id}`, data); // data: { quantity }



export const removeFromCart = (id) =>
    api.delete(`/cart/${id}`);

// Moves the guest cart (kept in the browser) into the account cart after login. items: [{ product_id, quantity }]
export const mergeCart = (items) =>
    api.post('/cart/merge', { items });

export const clearCart = () =>
    api.delete('/cart/clear'); // Optional: Function to clear entire cart if backend supports it
