import api from './axios';

export const getProducts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/products?${queryString}`);
};

export const getProduct = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (data) =>
  api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);
