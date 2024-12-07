import { useState } from 'react';
import { Search, User, Plus } from 'lucide-react';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Navigation Component - Changed from fixed to relative positioning
    const Navigation = () => (
        <div className="relative w-full bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold">Clear Task</div>
                    </div>
                    <nav className="flex space-x-6">
                        <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Home</span>
                        <span className="text-gray-900 font-medium cursor-pointer">Tasks</span>
                        <span className="text-gray-600 hover:text-gray-900 cursor-pointer">TimeView</span>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <User className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );

    // Sidebar Component - Changed to relative positioning
    const Sidebar = () => (
        <div className="w-64 bg-white border-r border-gray-200 p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lists</h2>
            <ul className="space-y-2">
                <li className="text-gray-600 hover:text-gray-900 cursor-pointer">Personal Tasks</li>
                <li className="text-gray-600 hover:text-gray-900 cursor-pointer">Work Tasks</li>
                <li className="text-gray-600 hover:text-gray-900 cursor-pointer">Shopping List</li>
            </ul>
        </div>
    );

    // Main Content Area - Restructured layout
    const MainContent = () => (
        <div className="flex-1 bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <button
                        onClick={() => setIsAddTaskOpen(true)}
                        className="mb-6 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 flex items-center space-x-2"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Task</span>
                    </button>

                    <div className="bg-gray-600 rounded-lg p-4 mb-6 min-h-[200px]">
                        {/* Example task for visualization */}
                        <div className="bg-white rounded p-3 mb-2">
                            <h4 className="font-medium">Example Task</h4>
                            <p className="text-sm text-gray-600">This is an example task description</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Completed</h3>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navigation />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <MainContent />
            </div>
            {isAddTaskOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Task Title"
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                placeholder="Task Description"
                                className="w-full p-2 border rounded h-32"
                            />
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsAddTaskOpen(false)}
                                className="text-gray-600 hover:text-gray-800 mr-4"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksPage;