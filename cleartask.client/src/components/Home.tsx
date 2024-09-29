import * as React from 'react';
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        alert('Button Clicked');
    }

    const handleRegisterClick = () => {
        navigate('/register');
    }

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is a simple homepage for your application.</p>

            <button onClick={handleClick}>Click Me</button>


            <button onClick={handleRegisterClick}></button>
        </div>
    );
};

export default Home;
