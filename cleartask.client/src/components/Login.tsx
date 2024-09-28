import React, { useState } from 'react';
import { login } from '../authService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.data.token); // Store the token
            console.log('Login successful:', response.data);
        } catch (error: any) {
            // Check if the error is an AxiosError using isAxiosError property
            if (error.isAxiosError && error.response) {
                console.error('Login failed:', error.response.data);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
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
