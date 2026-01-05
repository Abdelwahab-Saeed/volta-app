import api from './axios';

export const getAddresses = () => api.get('/addresses/user');

export const addAddress = (data) => api.post('/addresses', data);

export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);

export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
