import React, { useEffect, useState } from 'react';
import '../styles/Kanban.css';
import Navbar from './NavBar';
import { Task, getallTasks } from '../services/taskService';

const Kanban: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const userId = sessionStorage.getItem("userid") || "";
    const listId = userId;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getallTasks(userId);
                if (response.data && response.data.tasks) {
                    setTasks(response.data.tasks);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [userId, listId]);

    return (
        <div className="kanban-view-page">
            <Navbar />
            <div className="kanban-content">
                <div className="kanban-container">
                    {/* To Do Column */}
                    <div className="kanban-column">
                        <div className="column-header">
                            <span className="column-title">To Do</span>
                            <span className="task-count">
                                {tasks.filter(task => !task.isCompleted).length}
                            </span>
                        </div>
                        {tasks
                            .filter(task => !task.isCompleted)
                            .map(task => (
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

                    {/* In Progress Column */}
                    <div className="kanban-column">
                        <div className="column-header">
                            <span className="column-title">In Progress</span>
                            <span className="task-count">
                                {tasks.filter(task => !task.isCompleted && task.priority > 0).length}
                            </span>
                        </div>
                        {tasks
                            .filter(task => !task.isCompleted && task.priority > 0)
                            .map(task => (
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

                    {/* Completed Column */}
                    <div className="kanban-column">
                        <div className="column-header">
                            <span className="column-title">Completed</span>
                            <span className="task-count">
                                {tasks.filter(task => task.isCompleted).length}
                            </span>
                        </div>
                        {tasks
                            .filter(task => task.isCompleted)
                            .map(task => (
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
                </div>
            </div>
        </div>
    );
};

export default Kanban;