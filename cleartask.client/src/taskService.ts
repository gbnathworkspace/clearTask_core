import axios from 'axios';

interface Task {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    userId: string;
}

// Define the shape of the API response
interface GetTasksResponse {
    tasks: Task[];
}


// Set the base URL for your API
const API_BASE_URL = 'http://localhost:5076/api/task'; // Adjust the port if necessary


// Function to get all tasks for a specific user
export const getAllTasks = async (userId: string): Promise<{ data: GetTasksResponse }> => {
    const token = sessionStorage.getItem('token'); // Retrieve token each time
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    return await axios.get(`${API_BASE_URL}/getalltasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: { userId },
    });
};

// Function to create a new task
export const createTask = async (task: {
    title: string;
    description: string;
    userId: string;
}) => {
    const token = sessionStorage.getItem('token'); // Retrieve token each time
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }
    else {
        console.log(token);
    }

    return await axios.post(`${API_BASE_URL}/createtask`, task, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// Function to update the completion status of a task
export const updateTaskStatus = async (taskId: number, isCompleted: boolean) => {
    const token = sessionStorage.getItem('token'); // Retrieve token each time
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    return await axios.patch(`${API_BASE_URL}/updatetaskstatus`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            taskID: taskId,
            isCompleted: isCompleted,
        },
    });
};

// Function to delete a task
export const deleteTask = async (task: { id: number, userId: string }) => {
    const token = sessionStorage.getItem('token'); // Retrieve token each time
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    // Make the Axios request to delete the task
    return await axios.post(`${API_BASE_URL}/deletetask`, task, {
        headers: {
            'Content-Type': 'application/json', // Ensure JSON format
            Authorization: `Bearer ${token}`,
        },
    });
};

