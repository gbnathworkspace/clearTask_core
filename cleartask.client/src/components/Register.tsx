import React, { useState } from 'react';
import { register } from '../authService';
import { AxiosError } from 'axios';  // Import AxiosError type

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await register(email, password, confirmPassword);
            console.log('User registered:', response.data);
        } catch (error) {
            // Assert that the error is an AxiosError
            if (error instanceof AxiosError) {
                console.error('Registration failed:', error.response?.data);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    return (
        <form onSubmit={handleRegister}>
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
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
