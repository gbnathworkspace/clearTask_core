import React, { useEffect, useState } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import ReactDOM from 'react-dom';

import {
    Task,
    createTask,
    updateTaskStatus,
    deleteTask,
    fetchTasks,
} from '../services/taskService';
import { FiCalendar, FiCheck, FiEdit, FiRepeat, FiTrash } from 'react-icons/fi';
import '../styles/Tasks.css';

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDetails, setNewTaskDetails] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState(0);
    const [dueDate, setDueDate] = useState<string>('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const userId = sessionStorage.getItem('userid') || '';
    const [selectedList, setSelectedList] = useState(userId);
    const [listId, setListId] = useState<string>(selectedList);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);


    // Fetch tasks when the component mounts or when selectedList changes
    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const tasks = await fetchTasks(userId, listId);
                setTasks(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTaskData();
    }, [selectedList, listId]);

    const handleAddTask = async () => {
        const newTask: Task = {
            title: newTaskTitle,
            userId: userId,
            description: newTaskDetails,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority: newTaskPriority,
            isCompleted: false,
            listId: listId,
        };

        try {
            await createTask(newTask);
            setNewTaskTitle('');
            setNewTaskDetails('');
            setNewTaskPriority(0);
            setDueDate('');
            const updatedTasks = await fetchTasks(userId, listId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const handleTaskStatusToggle = async (task: Task) => {
        try {
            await updateTaskStatus(task.id, !task.isCompleted);
            const updatedTasks = await fetchTasks(userId, listId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task status', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            const updatedTasks = await fetchTasks(userId, listId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const closeCalendar = () => {
        setIsCalendarOpen(false);
    };

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 3:
                return '#ffcccc';
            case 2:
                return '#fff0b3';
            case 1:
                return '#ccffcc';
            default:
                return '#f2f2f2';
        }
    };

    const renderAddTaskModal = () => {
        return ReactDOM.createPortal(
            <div className="modal-overlay">
                <div className="modal-content">
                    <button
                        className="close-modal"
                        onClick={() => setIsAddTaskOpen(false)}
                    >
                        &times;
                    </button>
                    <h3>Add New Task</h3>
                    <div className="task-input-bar">
                        <div className="task-title">
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Task Details"
                                value={newTaskDetails}
                                onChange={(e) => setNewTaskDetails(e.target.value)}
                                className="task-details-input"
                            />
                        </div>
                        <div className="calendar-popup">
                            <label htmlFor="date">Due Date:</label>
                            <input
                                type="date"
                                id="date"
                                value={dueDate.split('T')[0]} // Extract date from ISO format
                                onChange={(e) =>
                                    setDueDate((prev) => `${e.target.value}T${prev.split('T')[1] || '00:00'}`)
                                }
                            />

                            <label htmlFor="time">Time:</label>
                            <input
                                type="time"
                                id="time"
                                value={dueDate.split('T')[1]?.slice(0, 5) || ''} // Extract time from ISO format
                                onChange={(e) =>
                                    setDueDate((prev) => `${prev.split('T')[0]}T${e.target.value}`)
                                }
                            />

                            <button
                                className="add-task-button"
                                onClick={() => {
                                    handleAddTask();
                                    closeCalendar();
                                    setIsAddTaskOpen(false);
                                }}
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body // Render outside the root div
        );
    };

    return (
        <div className="tasks-page">
            <Navbar />
            <div className="tasks-content">
                <Sidebar
                    selectedList={selectedList}
                    setSelectedList={(list) => {
                        setSelectedList(list);
                        setListId(list); // Update listId based on selection
                    }}
                />
                <div className="main-content">

                    {/* Main content */}
                    <button
                        className="add-task-trigger"
                        onClick={() => setIsAddTaskOpen(true)}
                    >
                        Add Task
                    </button>

                    {/* Render Modal if Open */}
                    {isAddTaskOpen && renderAddTaskModal()}




                    {/*tasklist*/}
                    <div className="task-list">
                        {tasks
                            .filter((task) => !task.isCompleted)
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="task-card"
                                    style={{
                                        backgroundColor: getPriorityColor(task.priority),
                                    }}
                                >
                                    <div className="task-details">
                                        <span className="task-title">{task.title}</span>
                                        <span className="task-description">
                                            {task.description}
                                        </span>
                                        {task.dueDate && (
                                            <div className="task-due-date">
                                                <FiCalendar className="calendar-icon" />
                                                <span>
                                                    {new Date(task.dueDate).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="task-actions">
                                        <FiEdit onClick={() => console.log('Edit task')} />
                                        <FiTrash
                                            onClick={() => handleDeleteTask(task.id)}
                                        />
                                        <FiCheck
                                            onClick={() => handleTaskStatusToggle(task)}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>


                    {/*completed list*/}
                    <div className="completed-tasks">
                        <h3>Completed</h3>
                        {tasks
                            .filter((task) => task.isCompleted)
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="task-card completed"
                                    style={{ backgroundColor: '#e0e0e0' }}
                                >
                                    <div className="task-details">
                                        <span className="task-title">{task.title}</span>
                                        <span className="task-description">
                                            {task.description}
                                        </span>
                                    </div>
                                    <div className="task-actions">
                                        <FiEdit onClick={() => console.log('Edit task')} />
                                        <FiTrash
                                            onClick={() => handleDeleteTask(task.id)}
                                        />
                                        <FiRepeat
                                            onClick={() => handleTaskStatusToggle(task)}
                                        />
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
