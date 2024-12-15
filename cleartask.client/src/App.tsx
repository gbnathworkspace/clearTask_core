import * as React from 'react';  // This is another valid import style
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import LoadingPage from './pages/LoadingPage';
import TasksPage from './pages/Tasks';
import TimeView from './pages/TimeView';
import Kanban from './pages/Kanban';
import './styles/theme.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<LandingPage />}></Route>
                <Route path='/tasks' element={<TasksPage />}></Route>
                <Route path="/timeview" element={<TimeView />} />
                <Route path="/kanban" element={<Kanban/>}/>
                <Route path="/loading" element={<LoadingPage />} />

            </Routes>
        </Router>
    );
};

export default App;
