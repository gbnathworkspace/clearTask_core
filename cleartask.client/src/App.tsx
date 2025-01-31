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
import ProtectedRoute from './components/ProtectedRoute';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>}></Route>
                <Route path='/tasks' element={<ProtectedRoute><TasksPage /></ProtectedRoute>}></Route>
                <Route path="/timeview" element={<ProtectedRoute><TimeView /></ProtectedRoute>} />
                <Route path="/kanban" element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
                <Route path="/loading" element={<ProtectedRoute><LoadingPage /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
