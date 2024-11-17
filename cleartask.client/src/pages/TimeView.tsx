import React, { useEffect, useState } from 'react';
import '../styles/TimeView.css';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import { Task, getAllTasks } from '../services/taskService';

const TimeView: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedList, setSelectedList] = useState('Groceries');
    const userId = sessionStorage.getItem("userid") || "";

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const allTasks = await getAllTasks(userId);
                console.log(allTasks.data.tasks);

                // If the API response does not include 'time', map it with a default value
                const tasksWithTime = allTasks.data.tasks.map((task) => ({
                    ...task,
                    time: task.time || getRandomTime(), // Provide a default 'time' value if missing
                }));

                setTasks(tasksWithTime);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchTasks();
    }, [userId]);

    const getRandomTime = (): string => {
        const randomHour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
        const randomMinute = (Math.floor(Math.random() / 2) * 30).toString().padStart(2, '0'); // 00 or 30 minutes
        return `${randomHour}:${randomMinute}`;
    };

    return (
        <div className="time-view-page">
            <Navbar />
            <div className="timeview-content">
                <Sidebar selectedList={selectedList} setSelectedList={setSelectedList} />
                <div className="timeline-container">
                    <h2>Day View</h2>
                    <div className="timeline">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="timeline-task"
                                style={{ left: `${getTaskPosition(task.time)}%` }}
                            >
                                <div className="task-bubble">{task.title}</div>
                                <div className="task-line"></div>
                            </div>
                        ))}
                    </div>
                    <div className="timeline-scale">
                        {Array.from({ length: 13 }, (_, i) => (
                            <div key={i} className="timeline-label">
                                {`${i * 2}:00`}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Function to calculate the task position based on time (24-hour format)
const getTaskPosition = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const percentage = (totalMinutes / 1440) * 100; // 1440 minutes in a day
    return percentage;
};

export default TimeView;
