import React from 'react';
import '../styles/LoadingPage.css';

const LoadingPage: React.FC = () => {
    return (
        <div className="loading-page">
            <div className="loading-content">
                <div className="spinner"></div>
                <div className="loading-text">Loading<span>.</span><span>.</span><span>.</span></div>
            </div>
        </div>
    );
};

export default LoadingPage;