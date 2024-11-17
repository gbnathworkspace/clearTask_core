/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import your logo image



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
    const navigate = useNavigate();

    const NavigateToLogin = () => {
        navigate('/Login')
    }

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
            navigate('/home');
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
        <div className="login-container">
            <img src={logo} alt="Clear Task Logo" className="logo" />
            <div className="login-box">
                <h1 className="login-title">Register</h1>
                <form onSubmit={handleRegister} className="login-form">
                    <input
                    className="login-input"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                    <input
                    className="login-input"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

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

                    <input
                    className="login-input"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />


                    <button className="login-button" type="submit" >Register</button>
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
                <div className="register-link">
                    Already have an Account? 
                    <a onClick={NavigateToLogin} className="link-text">
                     Login here
                    </a>
                </div>
            </div>
        </div>
    );

};

export default Register;
