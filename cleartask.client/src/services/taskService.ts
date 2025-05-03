import axios from 'axios';
import CONFIG from '../config';
import { checkToken ,getHeaders } from '../utils/authUtils';


const API_BASE_URL_task = `${ CONFIG.API_BASE_URL }api/task`;
const API_BASE_URL_ = `${ CONFIG.API_BASE_URL }api`;
export enum Priority {
    def = 0,
    low = 1,
    medium = 2,
    high = 3
}
export interface Task {
    id?: number;
    title: string;
    description: string;
    isCompleted: boolean;
    userId: string;
    dueDate?: Date;
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

// Set the base URL for your API


export const getAllLists = async (userId: string): Promise<{ data: GetListResponse }> => {
    const token = checkToken()

    return await axios.get(`${API_BASE_URL_}/list/getlists`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: { userId },
    });
}

export const createList = async (list: TaskList) => {
    const token = checkToken();

    return await axios.post(`${API_BASE_URL_}/list/createlist`, list, {
        headers:
        {
            Authorization: `Bearer ${token}`
        }
    });
};


// Function to get all tasks for a specific user
export const getTasks = async (userId: string, listId: string): Promise<{ data: GetTasksResponse }> => {
    const token = checkToken();


    return await axios.post(
        `${API_BASE_URL_task}/gettasks`,
        { userId, listId }, // Body of the request
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Ensure JSON content type
            },
        }
    );
};

export const getallTasks = async (userId: string): Promise<{ data: GetTasksResponse }> => {
    const token = checkToken();


    return await axios.get(
        `${API_BASE_URL_task}/getalltasks`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { userId },
        }
    );
};

// Function to create a new task
export const createTask = async (task: Task) => {
    const token = checkToken();


    return await axios.post(`${API_BASE_URL_task}/createtask`, task, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


// Function to update the completion status of a task
export const updateTaskStatus = async (taskId: number, isCompleted: boolean) => {
    const token = checkToken();


    return await axios.patch(`${API_BASE_URL_task}/updatetaskstatus`, null, {
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
    const headers = getHeaders();

    // Make the Axios request to delete the task
    return await axios.post(`${API_BASE_URL_task}/deletetask`, null, {
        headers,
        params: { Id : Id },
    });
};


export const fetchTasks = async (
    userId: string,
    listId: string
): Promise<Task[]> => {
    try {
        const response = await getTasks(userId, listId);
        if (response && response.data && response.data.tasks) {
            return response.data.tasks; // Return the tasks
        }
        return [];
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error; // Propagate the error for handling at the caller level
    }
};