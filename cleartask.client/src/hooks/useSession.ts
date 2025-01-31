import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp: number;
    nbf: number;
    iat: number;
}

export const useSession = (): void => {
    const navigate = useNavigate();

    const checkSessionValidity = (): boolean => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            return false;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    };

    const handleSessionExpiration = (): void => {
        const currentPath = window.location.pathname;

        // Don't store redirect URL for login or register pages
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            sessionStorage.setItem('redirectUrl', currentPath);
        }

        // Clear session storage but keep the redirectUrl
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        sessionStorage.clear();
        if (redirectUrl) {
            sessionStorage.setItem('redirectUrl', redirectUrl);
        }

        // Redirect to login
        navigate('/login');
    };

    useEffect(() => {
        // Initial session check
        if (!checkSessionValidity()) {
            handleSessionExpiration();
        }

        // Set up interval for periodic checks
        const intervalId = setInterval(() => {
            if (!checkSessionValidity()) {
                handleSessionExpiration();
            }
        }, 60000); // Check every minute

        // Set up focus event listener for tab/window focus
        const handleFocus = () => {
            if (!checkSessionValidity()) {
                handleSessionExpiration();
            }
        };
        window.addEventListener('focus', handleFocus);

        // Cleanup
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
        };
    }, [navigate]);
};