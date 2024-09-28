import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/'; // Your backend API base URL

// Register new user
export const register = (email: string, password: string, confirmPassword: string) => {
    return axios.post(API_URL + 'register', {
        email,
        password,
        confirmPassword
    });
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
