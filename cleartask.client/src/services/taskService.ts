import axios from 'axios';


export enum Priority {
    def = 0,
    low = 1,
    medium = 2,
    high = 3
}
export interface Task {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    userId: string;
    dueDate: Date;
    priority: number;
    listId: string;
}


export interface TaskList {
    listId: string;
    name: string;
    userId: string;
}

// Define the shape of the API response
interface GetTasksResponse {
    tasks: Task[];
}

interface GetListResponse {
    lists: TaskList[];
}

const token = sessionStorage.getItem('token'); // Retrieve token each time


// Set the base URL for your API
const API_BASE_URL = 'http://localhost:5076/api/task';
const API_BASE_URL_ = 'http://localhost:5076/api';// Adjust the port if necessary

export const getAllLists = async (userId: string): Promise<{ data: GetListResponse }> => {
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    return await axios.get(`${API_BASE_URL_}/list/getlists`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: { userId },
    });
}

export const createList = async (list: TaskList) => {
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    return await axios.post(`${API_BASE_URL_}/list/createlist`, list, {
        headers:
        {
            Authorization: `Bearer ${token}`
        }
    });
};


// Function to get all tasks for a specific user
export const getAllTasks = async (userId: string, listId: string): Promise<{ data: GetTasksResponse }> => {
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    return await axios.post(
        `${API_BASE_URL}/getalltasks`,
        { userId, listId }, // Body of the request
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Ensure JSON content type
            },
        }
    );
};

// Function to create a new task
export const createTask = async (task: Task) => {
    const token = sessionStorage.getItem('token');
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
export const deleteTask = async (Id: number) => {
    const token = sessionStorage.getItem('token'); // Retrieve token each time
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    // Make the Axios request to delete the task
    return await axios.post(`${API_BASE_URL}/deletetask`, null, {
        headers: { 
            Authorization: `Bearer ${token}`,
        },
        params: { Id : Id },
    });
};


//lists
