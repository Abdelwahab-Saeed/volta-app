import api from './axios';

export const getSettings = () => {
    return api.get('/settings');
};
