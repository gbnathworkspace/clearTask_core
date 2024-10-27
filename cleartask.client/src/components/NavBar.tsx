import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profilepic from '../assets/defaultuser.jpg';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown); // Toggle dropdown visibility
    };

    const handleOutsideClick = (e: MouseEvent) => {
        // Close the dropdown if clicking outside the profile picture or dropdown
        if (!(e.target as HTMLElement).closest('.navbar-profile')) {
            setShowDropdown(false);
        }
    };

    // Add event listener to detect outside clicks
    React.useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className="navbar">
            <div className="navbar-right">
                <div>Home</div>
                <div onClick={() => navigate('/tasks')} className="clickable-text">Tasks</div>
                <div>Home</div>
                <div>Home</div>
            </div>
            <div className="navbar-profile" onClick={handleProfileClick}>
                <img src={profilepic} alt="profilepic" />
                {/* Profile dropdown */}
                {showDropdown && (
                    <div className={`profile-dropdown ${showDropdown ? 'show' : ''}`}>
                        <div className="profile-info">
                            <p><strong>Name:</strong> John Doe</p>
                        </div>
                        <button onClick={() => navigate('/userprofile')}>View Profile</button>
                        <button onClick={() => navigate('/logout')}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
