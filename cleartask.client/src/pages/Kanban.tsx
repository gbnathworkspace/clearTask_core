import React, { useEffect, useState } from 'react';
import '../styles/Kanban.css';
import Navbar from './NavBar';
import { Task, getallTasks } from '../services/taskService';

const Kanban: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const userId = sessionStorage.getItem("userid") || "";

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getallTasks(userId);
                if (response?.data?.tasks) {
                    setTasks(response.data.tasks);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchTasks();
    }, [userId]);

    // Sort tasks by time categories
    const categorizeTask = (task: Task) => {
        if (!task.dueDate) return 'later';

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time portion

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate < today) return 'overdue';
        if (taskDate.getTime() === today.getTime()) return 'today';

        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);

        if (taskDate <= weekFromNow) return 'thisWeek';
        return 'later';
    };

    // Filter tasks by category
    const getTasksByCategory = (category: string) =>
        tasks.filter(task => categorizeTask(task) === category);

    const renderColumn = (title: string, category: string) => (
        <div className="kanban-column">
            <div className="column-header">
                <span className="column-title">{title}</span>
                <span className="task-count">{getTasksByCategory(category).length}</span>
            </div>
            {getTasksByCategory(category).map(task => (
                <div key={task.id} className="kanban-card">
                    <div className={`priority-indicator priority-${task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}`}></div>
                    <h3 className="card-title">{task.title}</h3>
                    <p className="card-description">{task.description}</p>
                    <div className="card-meta">
                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                        <span>Priority: {task.priority === 3 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="kanban-view-page">
            <Navbar />
            <div className="kanban-content">
                <div className="kanban-container">
                    {renderColumn('Overdue', 'overdue')}
                    {renderColumn('Today', 'today')}
                    {renderColumn('This Week', 'thisWeek')}
                    {renderColumn('Later', 'later')}
                </div>
            </div>
        </div>
    );
};


export default Kanban;