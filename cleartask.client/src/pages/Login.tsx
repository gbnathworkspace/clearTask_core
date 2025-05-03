/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import your logo image
import '../styles/Login.css';


interface LoginResponse {
    token: string;
    userid: string;
}

interface ErrorResponse {
    message: string;
    errors?: string[];
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();


    const handleLogoClick = () => {
        window.location.href = '/';
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            navigate('/loading');
            const response = await login(email, password);
            const responseData = response.data as LoginResponse;
            sessionStorage.setItem('token', responseData.token);
            sessionStorage.setItem('userid', responseData.userid);

            console.log('Login successful:', responseData.token);
            setSuccessMessage('Login successful!');
            navigate('/home');
        } catch (error: any) {
            const errorData: ErrorResponse = error.response?.data || { message: 'Login failed' };
            setErrorMessage(errorData.message);
            console.error('Error during login:', errorData.message);
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Clear Task Logo" className="logo" onClick={handleLogoClick} />
            <div className="login-box">
                <h1 className="login-title">Log in</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="login-button" type="submit">Login</button>
                </form>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="register-link">
                    Don't have an account?{' '}
                    <a onClick={() => navigate('/register')} className="link-text">Register here</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
