import * as React from 'react';  // This is another valid import style
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


//page imports
import Home from './pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import LoadingPage from './pages/LoadingPage';
import TasksPage from './pages/Tasks';
import TimeView from './pages/TimeView';
import Kanban from './pages/Kanban';
import ProtectedRoute from './components/ProtectedRoute';
import NewPage from './pages/test'
import Habitica from './pages/Habitica'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
            cacheTime: 30 * 60 * 1000, // Unused data remains in cache for 30 minutes
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: true, // Refresh data when user returns to the app
        },
    },
});


const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
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
                <Route path="/test" element={<NewPage />} />
                <Route path="/habitica" element={<Habitica />}></Route>
            </Routes>
        </Router>
            {/* Add React Query DevTools (only in development) */}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
};

export default App;
