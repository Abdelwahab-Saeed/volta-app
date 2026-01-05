import axiosInstance from "./axios";

export const getComparison = () => axiosInstance.get('/comparison');

export const addToComparison = (productId) => axiosInstance.post('/comparison', { product_id: productId });

export const removeFromComparison = (productId) => axiosInstance.delete(`/comparison/${productId}`);
