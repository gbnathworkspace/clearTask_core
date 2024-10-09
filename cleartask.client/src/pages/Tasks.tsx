import * as React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import profilepic from '../assets/defaultuser.jpg'

// Event handler to navigate to the profile page
const Home: React.FC = () => {

    // #region Declarations
    const navigate = useNavigate();

    const goToProfilePage = () => {
        navigate('/userprofile');
    };

    const NavigateToTasks = () => {
        navigate('/tasks');
    }
    // #endregion

    return (

        <div className="page">

            <div className="navbar">
                <div className="navbar-right">
                    <div>Home</div>
                    <div onClick={NavigateToTasks} className="clickable-text">Tasks</div>
                    <div>Home</div>
                    <div>Home</div>
                </div>
                <div className="navbar-profile" onClick={goToProfilePage}>
                    <img src={profilepic} alt="profilepic" style={{
                        maxHeight: '100%', maxWidth: '150%'
                    }} />
                </div>
            </div>

            <div className="taskbar-container">
                <button className="addtask">Add Task<h1>+</h1></button>
                <div className="taskbar">
                    <div className="heading">TASKS</div>
                    </div>
            </div>

        </div>

    );
}; 

export default Home;
