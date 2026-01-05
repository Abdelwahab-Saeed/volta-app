import { create } from 'zustand';
import { login, logout, me, register, updateProfile, changePassword } from '@/api/auth.api';

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
                const userData = res.data.data?.user || res.data.data;
                set({ user: userData, isAuthenticated: true });
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
            const resData = response.data.data;
            if (resData?.token) {
                localStorage.setItem('token', resData.token);
                const userData = resData.user || resData;
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
            const resData = response.data.data;
            if (resData?.token) {
                localStorage.setItem('token', resData.token);
                const userData = resData.user || resData;
                set({ user: userData, isAuthenticated: true });
            }
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

    updateUserProfile: async (data) => {
        try {
            const response = await updateProfile(data);
            const userData = response.data.data?.user || response.data.data;
            set({ user: userData });
            return response;
        } catch (error) {
            throw error;
        }
    },

    changeUserPassword: async (data) => {
        try {
            const response = await changePassword(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}));
