import * as React from 'react';  // This is another valid import style
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Register from './components/Register';
import Login from './components/Login';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<LandingPage />}></Route>
            </Routes>
        </Router>
    );
};

export default App;
