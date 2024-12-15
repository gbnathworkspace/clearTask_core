import React, { useEffect, useState } from 'react';
import Navbar from './NavBar';
import { Clock, Calendar, CheckSquare, TrendingUp, Activity, Star } from 'lucide-react';
import '../styles/Home.css';

interface Stats {
    tasksCompleted: number;
    tasksInProgress: number;
    upcomingDeadlines: number;
    streakDays: number;
}

const Home: React.FC = () => {
    const [stats, setStats] = useState<Stats>({
        tasksCompleted: 0,
        tasksInProgress: 0,
        upcomingDeadlines: 0,
        streakDays: 0
    });

    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        // Mock data - replace with actual API calls
        setStats({
            tasksCompleted: 12,
            tasksInProgress: 5,
            upcomingDeadlines: 3,
            streakDays: 7
        });

        // Get user's first name from session storage or API
        const userId = sessionStorage.getItem('userid');
        if (userId) {
            setUserName('User'); // Replace with actual user name from API
        }
    }, []);

    const recentActivities = [
        {
            icon: <CheckSquare className="activity-icon completed" />,
            text: "Completed 'Update presentation'",
            time: "2 hours ago"
        },
        {
            icon: <Calendar className="activity-icon deadline" />,
            text: "Added deadline to 'Client meeting prep'",
            time: "4 hours ago"
        },
        {
            icon: <Star className="activity-icon achievement" />,
            text: "Achieved 7-day streak!",
            time: "1 day ago"
        }
    ];

    return (
        <div className="home-page">
            <Navbar />
            <div className="home-main">
                <div className="home-container">
                    <div className="home-content">
                        {/* Welcome Section */}
                        <div className="welcome-section">
                            <h1>Welcome back, {userName}!</h1>
                            <p>Here's your productivity overview for today</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon-container completed">
                                    <CheckSquare />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.tasksCompleted}</h3>
                                    <p>Tasks Completed</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-container in-progress">
                                    <Activity />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.tasksInProgress}</h3>
                                    <p>In Progress</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-container upcoming">
                                    <Calendar />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.upcomingDeadlines}</h3>
                                    <p>Upcoming Deadlines</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-container streak">
                                    <Star />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.streakDays} Days</h3>
                                    <p>Productivity Streak</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="actions-grid">
                                <button className="action-button">
                                    <Clock />
                                    <span>Add Quick Task</span>
                                </button>
                                <button className="action-button">
                                    <Calendar />
                                    <span>View Calendar</span>
                                </button>
                                <button className="action-button">
                                    <TrendingUp />
                                    <span>View Analytics</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="recent-activity">
                            <h2>Recent Activity</h2>
                            <div className="activity-list">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="activity-item">
                                        {activity.icon}
                                        <div className="activity-details">
                                            <p className="activity-text">{activity.text}</p>
                                            <p className="activity-time">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;