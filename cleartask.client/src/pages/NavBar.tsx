import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import profilepic from '../assets/defaultuser.jpg';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const isActive = (path: string) => {
        return location.pathname === path;
    };

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
                <div className="logo-section">
                    <img src={logo} alt="Clear Task Logo" className="logo-image" />
                </div>

                <div className="navbar-links">
                    <div
                        className={`nav-item ${isActive('/home') ? 'active' : ''}`}
                        onClick={() => navigate('/home')}
                    >
                        Home
                    </div>
                    <div
                        className={`nav-item ${isActive('/tasks') ? 'active' : ''}`}
                        onClick={() => navigate('/tasks')}
                    >
                        Tasks
                    </div>
                    <div
                        className={`nav-item ${isActive('/timeview') ? 'active' : ''}`}
                        onClick={() => navigate('/timeview')}
                    >
                        TimeView
                    </div>
                    <div
                        className={`nav-item ${isActive('/kanban') ? 'active' : ''}`}
                        onClick={() => navigate('/kanban')}
                    >
                        KanbanView
                    </div>
                </div>

                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </form>

                <div className="navbar-profile" onClick={handleProfileClick}>
                    <img src={profilepic} alt="Profile" />
                    {showDropdown && (
                        <div className="profile-dropdown">
                            <div className="profile-info">
                                <p><strong>Name:</strong> John Doe</p>
                            </div>
                            <button onClick={() => navigate('/userprofile')}>View Profile</button>
                            <button onClick={() => navigate('/habitica')}>Habitica</button>
                            <button onClick={() => navigate('/login')}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;