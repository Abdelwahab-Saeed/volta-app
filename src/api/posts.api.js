import api from './axios';

export const getPosts = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/posts?${queryString}`);
};

export const getPost = (id) => api.get(`/posts/${id}`);
