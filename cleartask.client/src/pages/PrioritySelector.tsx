import React from 'react';
import { AlertTriangle, ArrowDown, ArrowRight, Flag } from 'lucide-react';

interface PrioritySelectorProps {
    priority: number;
    onChange: (priority: number) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ priority, onChange }) => {
    const getPriorityColor = (level: number) => {
        switch (level) {
            case 3: return 'text-red-600';
            case 2: return 'text-yellow-600';
            case 1: return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const getPriorityIcon = (level: number) => {
        switch (level) {
            case 3: return <AlertTriangle className="w-5 h-5" />;
            case 2: return <ArrowRight className="w-5 h-5" />;
            case 1: return <ArrowDown className="w-5 h-5" />;
            default: return <Flag className="w-5 h-5" />;
        }
    };

    const getPriorityLabel = (level: number) => {
        switch (level) {
            case 3: return 'High Priority';
            case 2: return 'Medium Priority';
            case 1: return 'Low Priority';
            default: return 'No Priority';
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {[0, 1, 2, 3].map((level) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => onChange(level)}
                        className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${priority === level
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <span className={getPriorityColor(level)}>
                            {getPriorityIcon(level)}
                        </span>
                        <span className="text-sm font-medium">
                            {getPriorityLabel(level)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PrioritySelector;