// LandingPage.tsx
import React from 'react';
import '../styles/LandingPage.css';
import logo from '../assets/logo.png'; // Import your logo image


const LandingPage: React.FC = () => {
    const handleRegisterClick = () => {
        window.location.href = '/register';
    };

    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    const handleLogoClick = () => {
        window.location.href = '/';
    };

    return (
        <div className="landing-container">
            <div className="logo-wrapper" onClick={handleLogoClick}>
                <img src={logo} alt="Clear Task Logo" className="logo" />
            </div>
                <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            <div className="landing-content">
                <div className="hero-section">
                    <h2 className="hero-title">
                        Simplify Your Tasks,<br />
                        Amplify Your Productivity
                    </h2>
                    <p className="hero-subtitle">
                        Transform your task management experience with Clear Task.
                        Organize, prioritize, and accomplish your goals with our
                        intuitive and powerful task management solution.
                    </p>
                    <div className="cta-buttons">
                        <button
                            className="cta-button primary-button"
                            onClick={handleRegisterClick}
                        >
                            Get Started
                        </button>
                        <button
                            className="cta-button secondary-button"
                            onClick={handleLoginClick}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;