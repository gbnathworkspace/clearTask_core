import React from 'react';
import { Flag, ArrowDown, ArrowRight, AlertTriangle, X } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    dueDate: string;
    setDueDate: (date: string) => void;
    priority: number;
    setPriority: (priority: number) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    priority,
    setPriority,
}) => {
    if (!isOpen) return null;

    const priorityButtons = [
        { value: 0, label: 'No Priority', icon: Flag },
        { value: 1, label: 'Low Priority', icon: ArrowDown },
        { value: 2, label: 'Medium Priority', icon: ArrowRight },
        { value: 3, label: 'High Priority', icon: AlertTriangle },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    onClick={onClose}
                    className="close-modal"
                >
                    <X size={20} />
                </button>

                <div className="modal-form">
                    <input
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="modal-input"
                    />

                    <textarea
                        placeholder="Enter task description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="modal-textarea"
                    />

                    <div className="date-time-inputs">
                        <div className="input-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={dueDate.split('T')[0]}
                                onChange={(e) => setDueDate(`${e.target.value}T${dueDate.split('T')[1] || '00:00'}`)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Time</label>
                            <input
                                type="time"
                                value={dueDate.split('T')[1]?.slice(0, 5) || ''}
                                onChange={(e) => setDueDate(`${dueDate.split('T')[0]}T${e.target.value}`)}
                            />
                        </div>
                    </div>

                    <div className="priority-buttons">
                        {priorityButtons.map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => setPriority(btn.value)}
                                className={`priority-button ${priority === btn.value ? 'active' : ''}`}
                            >
                                <btn.icon size={16} />
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <div className="modal-actions">
                        <button onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button onClick={onSubmit} className="submit-button">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;