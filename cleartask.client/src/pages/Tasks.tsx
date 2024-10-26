import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profilepic from '../assets/defaultuser.jpg';
import { getAllTasks, createTask, updateTaskStatus, deleteTask } from '../taskService'; // Updated to include status and delete APIs

interface Task {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    userId: string;
}

const Tasks: React.FC = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const userIdses = sessionStorage.getItem('userid') || '';
    const userId: string = userIdses;


    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getAllTasks(userId);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const handleAddTask = async () => {
        try {
            await createTask({ title: newTaskTitle, description: newTaskDescription, userId });
            fetchTasks(); // Refresh the task list after adding a task
            setNewTaskTitle('');
            setNewTaskDescription('');
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const handleTaskStatusToggle = async (task: Task) => {
        try {
            await updateTaskStatus(task.id, !task.isCompleted);
            fetchTasks(); // Refresh task list after status update
        } catch (error) {
            console.error('Error updating task status', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask({ id: taskId, userId });
            fetchTasks(); // Refresh task list after deletion
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const goToProfilePage = () => {
        navigate('/userprofile');
    };

    const pendingTasks = tasks.filter(task => !task.isCompleted);
    const completedTasks = tasks.filter(task => task.isCompleted);

    return (
        <div className="page">
            <div className="navbar">
                <div className="navbar-right">
                    <div>Home</div>
                    <div onClick={() => navigate('/tasks')} className="clickable-text">Tasks</div>
                    <div>Home</div>
                    <div>Home</div>
                </div>
                <div className="navbar-profile" onClick={goToProfilePage}>
                    <img src={profilepic} alt="profilepic" style={{
                        maxHeight: '100%', maxWidth: '150%'
                    }} />
                </div>
            </div>

            <div className="taskbar-container">
                <button className="addtask" onClick={handleAddTask}>
                    Add Task <h1>+</h1>
                </button>

                <div>
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Task Description"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                </div>

                <div className="taskbar">
                    <div className="heading">TASKS</div>


                    {/* Pending Tasks Section */}
                    <div>
                        <h2>Pending</h2>
                        {pendingTasks.length > 0 ? (
                            pendingTasks.map((task) => (
                                <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <p>Status: Incomplete</p>
                                    <button onClick={() => handleTaskStatusToggle(task)}>Mark as Complete</button>
                                    <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
                                </div>
                            ))
                        ) : (
                            <p>No pending tasks available</p>
                        )}
                    </div>

                    {/* Completed Tasks Section */}
                    <div>
                        <h2>Completed</h2>
                        {completedTasks.length > 0 ? (
                            completedTasks.map((task) => (
                                <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <p>Status: Completed</p>
                                    <button onClick={() => handleTaskStatusToggle(task)}>Mark as Incomplete</button>
                                    <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
                                </div>
                            ))
                        ) : (
                            <p>No completed tasks available</p>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Tasks;
