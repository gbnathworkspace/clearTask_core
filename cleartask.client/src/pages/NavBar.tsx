import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profilepic from '../assets/defaultuser.jpg';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search Query:', searchQuery);
    };

    return (
        <div className="navbar-container">


            <div className="navbar">
                {/* Logo Section */}
                <div className="logo-section">
                    <img src={logo} alt="Clear Task Logo" className="logo-image" />
                </div>


                {/* Navigation Links */}
                <div className="navbar-links">
                    <div className="nav-item" onClick={() => navigate('/home')}>Home</div>
                    <div className="nav-item" onClick={() => navigate('/tasks')}>Tasks</div>
                    <div className="nav-item" onClick={() => navigate('/timeview')}>TimeView</div>
                </div>

                {/* Search Bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </form>

                {/* Profile Section */}
                <div className="navbar-profile" onClick={handleProfileClick}>
                    <img src={profilepic} alt="Profile" />
                    {showDropdown && (
                        <div className="profile-dropdown">
                            <div className="profile-info">
                                <p><strong>Name:</strong> John Doe</p>
                            </div>
                            <button onClick={() => navigate('/userprofile')}>View Profile</button>
                            <button onClick={() => navigate('/login')}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
