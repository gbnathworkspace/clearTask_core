import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import SessionManager from '../services/SessionManager';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    useSession(); // Use our custom hook

    const sessionManager = SessionManager.getInstance();
    const isAuthenticated = !sessionManager.isTokenExpired();

    if (!isAuthenticated) {
        // Save the attempted URL for redirecting after login
        sessionStorage.setItem('redirectUrl', location.pathname);
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;