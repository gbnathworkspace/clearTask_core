import axios from 'axios';

const API_URL = 'http://localhost:5076/api/auth/'; // Your backend API base URL

// Register new user
export const register = (userData: { firstName: string, lastName: string, email: string, password: string}) => {
    return axios.post(API_URL + 'register', userData);
};

// Login user and get JWT token
export const login = (email: string, password: string) => {
    return axios.post(API_URL + 'login', {
        email,
        password
    });
};

// Logout user
export const logout = () => {
    return axios.post(API_URL + 'logout');
};

// Change password
export const changePassword = (currentPassword: string, newPassword: string) => {
    return axios.put(API_URL + 'change-password', {
        currentPassword,
        newPassword
    });
};

// Get current user info
export const getCurrentUserInfo = () => {
    return axios.get(API_URL + 'me');
};
