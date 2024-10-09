/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { login } from '../authService';
import styles from '../components/styles';
import { useNavigate } from 'react-router-dom';


interface LoginResponse {
    token: string;
}

interface ErrorResponse {
    message: string;
    // Add other properties if needed
}

interface ErrorResponse {
    message: string;
    errors?: string[];
}
const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string[] | null>(null);
    const Navigate = useNavigate();


    const NavigateToRegister = () => {
        Navigate('/register')
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseMessage(null);
        setErrorMessage(null);
        setErrorDetails(null);
        setSuccessMessage(null);
        try {
            const response = await login(email, password);
            const responseData = response.data as LoginResponse;
            localStorage.setItem('token', responseData.token);
            console.log('Login successful:', responseData.token);
            setSuccessMessage('Login successful:')
            Navigate('/home')
        } catch (error) {
            if (isErrorResponse(error)) {
                const errorData: ErrorResponse = error.response.data;
                const serverErrorMessage = errorData.message || 'Login failed';
                setErrorMessage(serverErrorMessage);
                setErrorDetails(errorData.errors || []);
                console.error('Registration failed:', serverErrorMessage);
            } else if (error instanceof Error) {
                setErrorMessage(error.message);
                console.error('An unexpected error occurred:', error.message);
            } else {
                setErrorMessage('An unexpected error occurred');
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    const isErrorResponse = (error: unknown): error is { response: { data: ErrorResponse } } => {
        return typeof error === 'object' && error !== null && 'response' in error && 'data' in (error as any).response;
    };

    return (
        <div style={styles.container}>
            <div style={styles.relativediv}>
        <form onSubmit={handleLogin}>
            <input
                style={styles.formBox}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
                <input
                style={styles.formBox}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                    />
                    <button style={styles.RegisterButton} type="submit">Login</button>
                </form>
                {successMessage && <p>{successMessage}</p>}
                {responseMessage && <p>{responseMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {errorDetails && errorDetails.length > 0 && (
                    <ul style={{ color: 'red' }}>
                        {errorDetails.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <div className="register-form-text">
                    Dont have an Account?
                    <a onClick={NavigateToRegister} className="login-link">
                        Register here
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
