import { login, logout, me, register } from '@/api/auth.api';
import { createContext, useContext, useEffect, useState } from 'react';


export const AuthContext = createContext();

// Custom hook for easy access to auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            me()
                .then(res => setUser(res.data))
                .catch(() => {
                    setUser(null);
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Register function
    const registerUser = async (data) => {
        const response = await register(data);
        // If the API returns a token on registration, store it
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            const userData = response.data.user || response.data;
            setUser(userData);
        }
        return response;
    };

    // Login function
    const loginUser = async (credentials) => {
        const response = await login(credentials);
        const userData = response.data.user || response.data;
        setUser(userData);
        return response;
    };

    // Logout function
    const logoutUser = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            registerUser,
            loginUser,
            logoutUser,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}
