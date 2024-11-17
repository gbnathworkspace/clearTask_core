import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import { Priority, Task, getAllTasks, createTask, updateTaskStatus, deleteTask } from '../services/taskService';
import { FiCalendar, FiCheck, FiEdit, FiRepeat, FiTrash } from 'react-icons/fi';
import '../styles/Tasks.css';

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState(0);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [selectedList, setSelectedList] = useState('Groceries');
    const userId = sessionStorage.getItem('userid') || '';

    useEffect(() => {
        fetchTasks();
    }, [selectedList]);

    const fetchTasks = async () => {
        try {
            const response = await getAllTasks(userId);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const handleAddTask = async () => {
        const newTask: Task = {
            id: 0,
            title: newTaskTitle,
            userId: userId,
            description: newTaskDescription,
            DueDate: dueDate ? dueDate.toISOString() : undefined,
            priority: newTaskPriority,
            isCompleted: false
        }

        try {
            await createTask(newTask);
            fetchTasks();
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskPriority(0);
            setDueDate(null);
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const handleTaskStatusToggle = async (task: Task) => {
        try {
            await updateTaskStatus(task.id, !task.isCompleted);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask({ id: taskId, userId });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return '#ffcccc';
            case 'Medium':
                return '#fff0b3';
            case 'Low':
                return '#ccffcc';
            default:
                return '#f2f2f2';
        }
    };

    return (
        <div className="tasks-page">
            <Navbar />
            <div className="tasks-content">
                <Sidebar selectedList={selectedList} setSelectedList={setSelectedList} />
                <div className="main-content">
                    <div className="task-input-bar">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />

                        <input
                            type="date"
                            placeholder="Due Date"
                            value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => setDueDate(new Date(e.target.value))}
                            className="due-date-input"
                        />
                        <button onClick={handleAddTask}>
                            <FiCalendar />
                        </button>
                        <button onClick={handleAddTask}>+</button>
                    </div>

                    <div className="task-list">
                        {tasks.filter(task => !task.isCompleted).map((task) => (
                            <div
                                key={task.id}
                                className="task-card"
                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                                <div className="task-details">
                                    <span className="task-title">{task.title}</span>
                                    <span className="task-description">{task.description}</span>
                                </div>
                                <div className="task-actions">
                                    <FiEdit onClick={() => console.log('Edit task')} />
                                    <FiTrash onClick={() => handleDeleteTask(task.id)} />
                                    <FiCheck onClick={() => handleTaskStatusToggle(task)}/>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="completed-tasks">
                        <h3>Completed</h3>
                        {tasks.filter(task => task.isCompleted).map((task) => (
                            <div
                                key={task.id}
                                className="task-card completed"
                                style={{ backgroundColor: '#e0e0e0' }}
                            >
                                <div className="task-details">
                                    <span className="task-title">{task.title}</span>
                                    <span className="task-description">{task.description}</span>
                                </div>
                                <div className="task-actions">
                                    <FiEdit onClick={() => console.log('Edit task')} />
                                    <FiTrash onClick={() => handleDeleteTask(task.id)} />
                                    <FiRepeat onClick={() => handleTaskStatusToggle(task)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
