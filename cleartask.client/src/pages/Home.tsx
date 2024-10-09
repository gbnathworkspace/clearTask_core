import * as React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import profilepic from '../assets/defaultuser.jpg'

// Event handler to navigate to the profile page
const Home: React.FC = () => {
    const navigate = useNavigate();

    // Function to handle profile navigation
    const goToProfilePage = () => {
        navigate('/userprofile');
    };

    const NavigateToTasks = () => {
        navigate('/tasks');
    }


    return (
        <div className="navbar">
            <div className="navbar-right">
                <div>Home</div>
                <div onClick={NavigateToTasks} className= "clickable-text">Tasks</div>
                <div>Home</div>
                <div>Home</div>
            </div>
            <div className="navbar-profile" onClick={goToProfilePage}>
                <img src={profilepic} alt="profilepic" style={{
                    maxHeight: '100%', maxWidth: '150%'
                }} />
            </div>
        </div>
    );
};

export default Home;
