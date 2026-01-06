import api from './axios';

export const getBanners = () => api.get('/banners');
