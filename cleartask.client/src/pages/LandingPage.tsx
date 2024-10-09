import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../components/styles'

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    }
    const handleClick_login = () => {
        navigate('/login');
    }

    return (
        <div style={styles.container}>
            <div style={styles.relativediv}>
                <h1>Welcome to ClearTask</h1>

                <button style={styles.RegisterButton} onClick={handleRegisterClick}>Register</button>

                <button style={styles.RegisterButton} onClick={handleClick_login}>Login</button>

            </div>
        </div>
    );
}

export default LandingPage;