import { create } from 'zustand';
import { login, logout, me, register } from '@/api/auth.api';

export const useAuthStore = create((set, get) => ({
    user: null,
    loading: true,
    isAuthenticated: false,

    // Actions
    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                set({ loading: true });
                const res = await me();
                set({ user: res.data, isAuthenticated: true });
            } catch (error) {
                console.error('Check auth error:', error);
                set({ user: null, isAuthenticated: false });
                localStorage.removeItem('token');
            } finally {
                set({ loading: false });
            }
        } else {
            set({ loading: false, user: null, isAuthenticated: false });
        }
    },

    registerUser: async (data) => {
        try {
            const response = await register(data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                const userData = response.data.user || response.data;
                set({ user: userData, isAuthenticated: true });
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    loginUser: async (credentials) => {
        try {
            const response = await login(credentials);
            const userData = response.data.user || response.data;
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            set({ user: userData, isAuthenticated: true });
            return response;
        } catch (error) {
            throw error;
        }
    },

    logoutUser: async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            set({ user: null, isAuthenticated: false });
            localStorage.removeItem('token');
        }
    },
}));
