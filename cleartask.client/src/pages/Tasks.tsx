import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import { FiCalendar, FiCheck, FiEdit, FiRepeat, FiTrash } from 'react-icons/fi';
import {
    Task,
    createTask,
    updateTaskStatus,
    deleteTask,
    fetchTasks,
} from '../services/taskService';
import TaskModal from './TaskModal';
import '../styles/Tasks.css';

interface TaskForm {
    title: string;
    description: string;
    priority: number;
    dueDate: string;
}

const initialTaskForm: TaskForm = {
    title: '',
    description: '',
    priority: 0,
    dueDate: ''
};

const Tasks: React.FC = () => {
    // State Management
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskForm, setTaskForm] = useState<TaskForm>(initialTaskForm);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const userId = sessionStorage.getItem('userid') || '';
    const [selectedList, setSelectedList] = useState(userId);
    const [listId, setListId] = useState<string>(selectedList);

    // Navigation State
    const location = useLocation();
    const selectedTaskId = location.state?.selectedTaskId;

    // Fetch Tasks
    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const fetchedTasks = await fetchTasks(userId, listId);
                setTasks(fetchedTasks);

                // Handle task highlighting from timeline navigation
                if (selectedTaskId) {
                    setTimeout(() => {
                        const element = document.getElementById(`task-${selectedTaskId}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.classList.add('highlighted-task');
                            setTimeout(() => element.classList.remove('highlighted-task'), 2000);
                        }
                    }, 100);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTaskData();
    }, [selectedList, listId, selectedTaskId, userId]);

    // Task Actions
    const handleAddTask = async () => {
        const newTask: Task = {
            title: taskForm.title,
            userId: userId,
            description: taskForm.description,
            dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
            priority: taskForm.priority,
            isCompleted: false,
            listId: listId,
        };

        try {
            await createTask(newTask);
            setTaskForm(initialTaskForm);
            setIsAddTaskOpen(false);
            const updatedTasks = await fetchTasks(userId, listId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleTaskStatusToggle = async (task: Task) => {
        try {
            await updateTaskStatus(task.id, !task.isCompleted);
            const updatedTasks = await fetchTasks(userId, listId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            const updatedTasks = await fetchTasks(userId, listId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Utility Functions
    const getPriorityClass = (priority: number): string => {
        switch (priority) {
            case 3: return 'priority-high';
            case 2: return 'priority-medium';
            case 1: return 'priority-low';
            default: return 'priority-none';
        }
    };

    const formatDueDate = (date: Date | undefined): string => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Render Task Card
    const renderTaskCard = (task: Task, isCompleted: boolean = false) => (
        <div
            key={task.id}
            id={`task-${task.id}`}
            className={`task-card ${isCompleted ? 'completed' : ''} ${task.id === selectedTaskId ? 'highlighted-task' : ''}`}
        >
            <div className={`priority-indicator ${getPriorityClass(task.priority)}`} />
            <div className="task-details">
                <span className="task-title">{task.title}</span>
                <span className="task-description">{task.description}</span>
                {!isCompleted && (
                    <div className="task-metadata">
                        {task.dueDate && (
                            <div className="task-due-date">
                                <FiCalendar className="calendar-icon" />
                                <span>{formatDueDate(task.dueDate)}</span>
                            </div>
                        )}
                        <span className={`priority-label ${getPriorityClass(task.priority)}`}>
                            {`${getPriorityClass(task.priority).split('-')[1].charAt(0).toUpperCase() + getPriorityClass(task.priority).split('-')[1].slice(1)} Priority`}
                        </span>
                    </div>
                )}
            </div>
            <div className="task-actions">
                <FiEdit className="action-icon" onClick={() => console.log('Edit task:', task.id)} />
                <FiTrash className="action-icon" onClick={() => handleDeleteTask(task.id)} />
                {isCompleted ? (
                    <FiRepeat className="action-icon" onClick={() => handleTaskStatusToggle(task)} />
                ) : (
                    <FiCheck className="action-icon" onClick={() => handleTaskStatusToggle(task)} />
                )}
            </div>
        </div>
    );

    return (
        <div className="tasks-page">
            <Navbar />
            <div className="tasks-content">
                <Sidebar
                    selectedList={selectedList}
                    setSelectedList={(list) => {
                        setSelectedList(list);
                        setListId(list);
                    }}
                />
                <div className="main-content">
                    <button
                        className="add-task-button"
                        onClick={() => setIsAddTaskOpen(true)}
                    >
                        Add Task
                    </button>

                    {isAddTaskOpen && (
                        <TaskModal
                            isOpen={isAddTaskOpen}
                            onClose={() => setIsAddTaskOpen(false)}
                            onSubmit={handleAddTask}
                            title={taskForm.title}
                            setTitle={(title) => setTaskForm({ ...taskForm, title })}
                            description={taskForm.description}
                            setDescription={(description) => setTaskForm({ ...taskForm, description })}
                            dueDate={taskForm.dueDate}
                            setDueDate={(dueDate) => setTaskForm({ ...taskForm, dueDate })}
                            priority={taskForm.priority}
                            setPriority={(priority) => setTaskForm({ ...taskForm, priority })}
                        />
                    )}

                    <div className="task-list">
                        {tasks.filter(task => !task.isCompleted).map(task => renderTaskCard(task))}
                    </div>

                    <div className="completed-tasks">
                        <h3>Completed</h3>
                        {tasks.filter(task => task.isCompleted).map(task => renderTaskCard(task, true))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;