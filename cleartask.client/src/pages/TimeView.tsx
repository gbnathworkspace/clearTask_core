import React, { useEffect, useState } from 'react';
import '../styles/TimeView.css';
import Navbar from './NavBar';
import { Task, getallTasks } from '../services/taskService';
import { useNavigate } from 'react-router-dom';

const TimeView: React.FC = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedView, setSelectedView] = useState<'day' | 'month' | 'year'>('day');
    const userId = sessionStorage.getItem("userid") || "";

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getallTasks(userId);
                const tasksWithDates = response.data.tasks
                    .filter(task => task.dueDate != null)
                    .map(task => ({
                        ...task,
                        dueDate: new Date(task.dueDate as string)
                    }))
                    .sort((a, b) => {
                        const dateA = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
                        const dateB = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
                        return dateA.getTime() - dateB.getTime();
                    });

                setTasks(tasksWithDates);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [userId]);

    const getTaskPosition = (date: Date | string | undefined): number => {
        if (!date) return 0;
        const taskDate = date instanceof Date ? date : new Date(date);

        switch (selectedView) {
            case 'day': {
                const startOfDay = new Date(taskDate);
                startOfDay.setHours(0, 0, 0, 0);
                const timeDiff = taskDate.getTime() - startOfDay.getTime();
                const minutesSinceMidnight = timeDiff / (1000 * 60);
                return (minutesSinceMidnight / 1440) * 100; // 1440 minutes in a day
            }
            case 'month': {
                const dayOfMonth = taskDate.getDate();
                const daysInMonth = new Date(taskDate.getFullYear(), taskDate.getMonth() + 1, 0).getDate();
                return ((dayOfMonth - 1) / (daysInMonth - 1)) * 100;
            }
            case 'year': {
                const monthIndex = taskDate.getMonth();
                const dayOfMonth = taskDate.getDate();
                const daysInMonth = new Date(taskDate.getFullYear(), monthIndex + 1, 0).getDate();

                // Calculate position based on month and day within month
                const monthPosition = monthIndex / 12;
                const dayPosition = (dayOfMonth - 1) / daysInMonth / 12;
                return (monthPosition + dayPosition) * 100;
            }
            default:
                return 0;
        }
    };

    const formatTaskTime = (date: Date | string | undefined): string => {
        if (!date) return '';
        const taskDate = date instanceof Date ? date : new Date(date);

        switch (selectedView) {
            case 'day':
                return taskDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            case 'month':
                return `${taskDate.getDate()} ${taskDate.toLocaleString('default', { month: 'short' })}`;
            case 'year':
                return `${taskDate.toLocaleString('default', { month: 'short' })} ${taskDate.getDate()}`;
            default:
                return '';
        }
    };

    const handleViewChange = (view: 'day' | 'month' | 'year') => {
        setSelectedView(view);
    };

    const getTimelineLabels = () => {
        switch (selectedView) {
            case 'day':
                return Array.from({ length: 25 }, (_, i) => ({
                    position: (i / 24) * 100,
                    label: `${String(i).padStart(2, '0')}:00`
                }));
            case 'month': {
                const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
                return Array.from({ length: daysInMonth }, (_, i) => ({
                    position: (i / (daysInMonth - 1)) * 100,
                    label: `${i + 1}`
                }));
            }
            case 'year':
                // Create 13 points to properly show start and end of each month
                return Array.from({ length: 13 }, (_, i) => ({
                    position: (i / 12) * 100,
                    label: i < 12 ? new Date(2000, i).toLocaleString('default', { month: 'short' }) : ''
                }));
            default:
                return [];
        }
    };

    const getFilteredTasks = (): Task[] => {
        return tasks.filter((task) => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);

            switch (selectedView) {
                case 'day':
                    return (
                        taskDate.getDate() === selectedDate.getDate() &&
                        taskDate.getMonth() === selectedDate.getMonth() &&
                        taskDate.getFullYear() === selectedDate.getFullYear()
                    );
                case 'month':
                    return (
                        taskDate.getMonth() === selectedDate.getMonth() &&
                        taskDate.getFullYear() === selectedDate.getFullYear()
                    );
                case 'year':
                    return taskDate.getFullYear() === selectedDate.getFullYear();
                default:
                    return false;
            }
        });
    };

    return (
        <div className="time-view-page">
            <Navbar />
            <div className="timeview-content">
                <div className="timeline-container">
                    <div className="timeline-header">
                        <div className="view-buttons">
                            <button
                                className={selectedView === 'day' ? 'active' : ''}
                                onClick={() => handleViewChange('day')}
                            >
                                Day
                            </button>
                            <button
                                className={selectedView === 'month' ? 'active' : ''}
                                onClick={() => handleViewChange('month')}
                            >
                                Month
                            </button>
                            <button
                                className={selectedView === 'year' ? 'active' : ''}
                                onClick={() => handleViewChange('year')}
                            >
                                Year
                            </button>
                        </div>
                        <div className="view-selectors">
                            {selectedView === 'day' && (
                                <input
                                    type="date"
                                    value={selectedDate.toISOString().slice(0, 10)}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                />
                            )}
                            {selectedView === 'month' && (
                                <div>
                                    <select
                                        value={selectedDate.getMonth()}
                                        onChange={(e) => setSelectedDate(new Date(selectedDate.getFullYear(), parseInt(e.target.value), 1))}
                                    >
                                        {[
                                            'January', 'February', 'March', 'April', 'May', 'June',
                                            'July', 'August', 'September', 'October', 'November', 'December'
                                        ].map((month, i) => (
                                            <option key={i} value={i}>{month}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedDate.getFullYear()}
                                        onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), selectedDate.getMonth(), 1))}
                                    >
                                        {Array.from({ length: 11 }, (_, i) => {
                                            const year = new Date().getFullYear() + i - 5;
                                            return (
                                                <option key={year} value={year}>{year}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}
                            {selectedView === 'year' && (
                                <select
                                    value={selectedDate.getFullYear()}
                                    onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), 0, 1))}
                                >
                                    {Array.from({ length: 11 }, (_, i) => {
                                        const year = new Date().getFullYear() + i - 5;
                                        return (
                                            <option key={year} value={year}>{year}</option>
                                        );
                                    })}
                                </select>
                            )}
                        </div>
                        <div className="timeline">
                            {getFilteredTasks().map((task) => (
                                <div
                                    key={task.id}
                                    className="timeline-task"
                                    style={{ left: `${getTaskPosition(task.dueDate)}%` }}
                                    onClick={() => {
                                        navigate('/tasks', { state: { selectedTaskId: task.id } });
                                    }}
                                >
                                    <div className="task-bubble">
                                        {task.title}
                                        <div className="task-time">
                                            {formatTaskTime(task.dueDate)}
                                        </div>
                                    </div>
                                    <div className="task-line"></div>
                                </div>
                            ))}
                            <div className="timeline-scale">
                                {getTimelineLabels().map(({ position, label }, index) => (
                                    <div
                                        key={index}
                                        className="timeline-tick"
                                        style={{ left: `${position}%` }}
                                    >
                                        <div className="timeline-label">{label}</div>
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

export default TimeView;