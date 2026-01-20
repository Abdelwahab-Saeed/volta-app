import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { t } = useTranslation();
    const { isAuthenticated, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-primary font-medium text-lg">{t('auth.verifying_identity')}</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Store the attempted URL to redirect back after login if needed
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
