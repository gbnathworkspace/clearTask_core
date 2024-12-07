import React, { useEffect, useState } from 'react';
import '../styles/TimeView.css';
import Navbar from './NavBar';
import { Task, getAllTasks } from '../services/taskService';

const TimeView: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedView, setSelectedView] = useState<'day' | 'month' | 'year'>('day');
    const userId = sessionStorage.getItem("userid") || "";
    const listId = userId;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getAllTasks(userId, listId);
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
    }, [userId, listId]);

    const getTaskPosition = (date: Date | string | undefined): number => {
        try {
            if (!date) return 0;
            const taskDate = date instanceof Date ? date : new Date(date);

            switch (selectedView) {
                case 'day':
                    {
                        const hours = taskDate.getHours();
                        const minutes = taskDate.getMinutes();
                        const totalMinutes = hours * 60 + minutes;
                        return (totalMinutes / 1440) * 100; // 1440 minutes in a day
                    }
                case 'month':
                    {
                        const daysInMonth = new Date(taskDate.getFullYear(), taskDate.getMonth() + 1, 0).getDate();
                        return (taskDate.getDate() / daysInMonth) * 100;
                    }
                case 'year':
                    {
                        const daysInYear = 365; // Assuming non-leap year
                        return (taskDate.getMonth() * 30 + taskDate.getDate()) / daysInYear * 100;
                    }
                default:
                    return 0;
            }
        } catch (error) {
            console.error("Error calculating task position:", error);
            return 0;
        }
    };

    const formatTaskTime = (date: Date | string | undefined): string => {
        try {
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
        } catch (error) {
            console.error("Error formatting time:", error);
            return '';
        }
    };

    const handleViewChange = (view: 'day' | 'month' | 'year') => {
        setSelectedView(view);
    };

    const getDaysInMonth = (): number => {
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
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
                    return (
                        taskDate.getFullYear() === selectedDate.getFullYear()
                    );
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
                    <div className="view-selector">
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
                        <div className="selectors">
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
                                        onChange={(e) => setSelectedDate(new Date(selectedDate.getFullYear(), parseInt(e.target.value), selectedDate.getDate()))}
                                    >
                                        {[
                                            'January', 'February', 'March', 'April', 'May', 'June',
                                            'July', 'August', 'September', 'October', 'November', 'December',
                                        ].map((month, i) => (
                                            <option key={i} value={i}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedDate.getFullYear()}
                                        onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), selectedDate.getMonth(), selectedDate.getDate()))}
                                    >
                                        {Array.from({ length: 10 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
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
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="timeline">
                        {getFilteredTasks().map((task) => (
                            <div
                                key={task.id}
                                className="timeline-task"
                                style={{ left: `${getTaskPosition(task.dueDate)}%` }}
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
                    </div>
                    <div className="timeline-scale">
                        {selectedView === 'day' && Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="timeline-tick">
                                <div className="timeline-label">{`${i}:00`}</div>
                            </div>
                        ))}
                        {selectedView === 'month' && Array.from({ length: getDaysInMonth() }, (_, i) => (
                            <div key={i} className="timeline-tick">
                                <div className="timeline-label">{i + 1}</div>
                            </div>
                        ))}
                        {selectedView === 'year' && Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="timeline-tick">
                                <div className="timeline-label">
                                    {new Date(selectedDate.getFullYear(), i).toLocaleDateString('default', { month: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeView;