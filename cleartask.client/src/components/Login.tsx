import React, { useState } from 'react';
import { login } from '../authService';

interface LoginResponse {
    token: string;
}

interface ErrorResponse {
    message: string;
    // Add other properties if needed
}

interface AxiosError {
    response?: {
        data: ErrorResponse;
    };
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            const responseData = response.data as LoginResponse;
            localStorage.setItem('token', responseData.token);
            console.log('Login successful:', responseData.token);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('Login failed:', (error as AxiosError).response?.data.message);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    const isAxiosError = (error: unknown): error is AxiosError => {
        return (error as AxiosError).response !== undefined;
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
