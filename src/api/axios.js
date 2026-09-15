import axios from 'axios';
import i18n, { baseLanguage } from '@/i18n';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: 'application/json',
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    // Ask i18next rather than reading localStorage: the stored value can be a
    // regional tag ("ar-EG") and is missing on a first visit, where the
    // detector has still resolved a language from the browser.
    config.headers['Accept-Language'] = baseLanguage(i18n.resolvedLanguage || i18n.language) || 'ar';

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
