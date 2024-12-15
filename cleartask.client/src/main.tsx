import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Type guard to ensure root element exists
if (!rootElement) {
    throw new Error(
        'Failed to find root element - please ensure there is a <div id="root"></div> in your HTML'
    );
}

// Create and render root
const root = createRoot(rootElement);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);