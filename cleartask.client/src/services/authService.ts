import axios from 'axios';
import CONFIG from '../../config/config';

export const API_URL = `${CONFIG.API_BASE_URL}api/auth/`;

/**
 * Register a new user.
 * @param userData - The user data including firstName, lastName, email, and password.
 * @returns A promise that resolves to the response from the API.
 */
export const register = (userData: {
    firstName: string, lastName: string, email: string, password: string;
}) => {

    console.log("User Data:", userData);
    return axios.post(`${API_URL}register`, userData);
};

/**
 * Login a user and get a JWT token.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves to the response from the API.
 */
export const login = (email: string, password: string) => {
    return axios.post(API_URL + 'login', {
        email,
        password
    });
};

/**
 * Logout the currently authenticated user.
 * @returns A promise that resolves to the response from the API.
 */
export const logout = () => {
    return axios.post(API_URL + 'logout');
}; 

/**
 * Change the password of the currently authenticated user.
 * @param currentPassword - The current password.
 * @param newPassword - The new password.
 * @returns A promise that resolves to the response from the API.
 */
export const changePassword = (currentPassword: string, newPassword: string) => {
    return axios.put(API_URL + 'change-password', {
        currentPassword,
        newPassword
    });
};

/**
 * Get the information of the currently authenticated user.
 * @returns A promise that resolves to the response from the API.
 */
export const getCurrentUserInfo = () => {
    return axios.get(API_URL + 'me');
};
