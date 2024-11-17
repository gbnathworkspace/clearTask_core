import * as React from 'react';
import '../App.css';
import Navbar from './NavBar';
import '../styles/Home.css';

// Event handler to navigate to the profile page
const Home: React.FC = () => {
    return (
        <div className="home-page">
            <Navbar />
        </div>

    );
};

export default Home;
