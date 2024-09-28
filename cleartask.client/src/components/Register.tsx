import { useState } from 'react';
import { register } from '../authService';

interface ErrorResponse {
    message: string;
    // Add other properties if needed
}

interface AxiosError {
    isAxiosError: boolean;
    response?: {
        data: ErrorResponse;
    };
    config: {
        data: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            confirmPassword: string;
        };
    };
}

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseMessage(null);
        setErrorMessage(null);
        try {
            const response = await register({ firstName, lastName, email, password });
            setResponseMessage('User registered successfully!');
            console.log('User registered:', response.data);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const axiosError = error as AxiosError;
                setErrorMessage(axiosError.response?.data.message || 'Registration failed');
                console.error('Registration failed:', axiosError.response?.data.message);
                console.error('Request data:', axiosError.config.data);
            } else {
                setErrorMessage('An unexpected error occurred');
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    const isAxiosError = (error: unknown): error is AxiosError => {
        return (error as AxiosError).isAxiosError !== undefined;
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
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
            {responseMessage && <p>{responseMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default Register;
