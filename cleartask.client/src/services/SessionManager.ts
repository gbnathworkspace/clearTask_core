import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp: number;
    nbf: number;
    iat: number;
}

class SessionManager {
    private static instance: SessionManager;
    private tokenCheckInterval: number | null = null;
    private readonly TOKEN_CHECK_INTERVAL = 60000; // Check every minute

    private constructor() {
        // Private constructor for singleton pattern
        this.setupTokenCheck();
        this.setupAxiosInterceptor();
    }

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    private setupTokenCheck(): void {
        // Clear any existing interval
        if (this.tokenCheckInterval) {
            window.clearInterval(this.tokenCheckInterval);
        }

        // Set up new interval
        this.tokenCheckInterval = window.setInterval(() => {
            if (this.isTokenExpired()) {
                this.handleSessionExpiration();
            }
        }, this.TOKEN_CHECK_INTERVAL);
    }

    private setupAxiosInterceptor(): void {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.handleSessionExpiration();
                }
                return Promise.reject(error);
            }
        );
    }

    public isTokenExpired(): boolean {
        const token = sessionStorage.getItem('token');
        if (!token) return true;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    }

    private handleSessionExpiration(): void {
        // Clear session storage
        sessionStorage.clear();

        // Check if we're already on the login page to prevent redirect loops
        if (!window.location.pathname.includes('/login')) {
            // Store the current location to redirect back after login
            sessionStorage.setItem('redirectUrl', window.location.pathname);

            // Redirect to login page
            window.location.href = '/login';
        }
    }

    public checkSession(): void {
        if (this.isTokenExpired()) {
            this.handleSessionExpiration();
        }
    }

    // Call this when component mounts
    public initializeSession(): void {
        this.checkSession();
        addEventListener('focus', () => this.checkSession());
    }

    // Clean up when component unmounts
    public cleanupSession(): void {
        if (this.tokenCheckInterval) {
            window.clearInterval(this.tokenCheckInterval);
        }
        removeEventListener('focus', () => this.checkSession());
    }
}

export default SessionManager;