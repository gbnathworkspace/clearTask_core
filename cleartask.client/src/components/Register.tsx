/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { register } from '../authService';
import styles from './styles';

// Rest of the code...


// Define the structure of the error response from the server
interface ErrorResponse {
    message: string;
    errors?: string[];
}

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string[] | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseMessage(null);
        setErrorMessage(null);
        setErrorDetails(null);

        // Client-side validation for matching passwords
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await register({ firstName, lastName, email, password, confirmPassword });
            setResponseMessage('User registered successfully!');
            console.log('User registered:', response.data);
        } catch (error) {
            if (isErrorResponse(error)) {
                const errorData: ErrorResponse = error.response.data;
                const serverErrorMessage = errorData.message || 'Registration failed';
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

    // Type guard to check if the error is an ErrorResponse
    const isErrorResponse = (error: unknown): error is { response: { data: ErrorResponse } } => {
        return typeof error === 'object' && error !== null && 'response' in error && 'data' in (error as any).response;
    };




    return (
        <div style={styles.container}>
            <div style={styles.relativediv}>
                <form onSubmit={handleRegister}>
                    <input
                    style={styles.formBox}
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                    <input
                    style={styles.formBox}
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

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

                    <input
                    style={styles.formBox}
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />


                    <button style={styles.RegisterButton} type="submit">Register</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {errorDetails && errorDetails.length > 0 && (
                <ul style={{ color: 'red' }}>
                    {errorDetails.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );

};

export default Register;
