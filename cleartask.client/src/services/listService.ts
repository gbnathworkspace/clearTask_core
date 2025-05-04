import { TaskList } from '../services/taskService';
import { getAllLists } from '../services/taskService';
import axios from 'axios';
import CONFIG from '../../config/config';


const API_BASE_URL_ = `${CONFIG.API_BASE_URL}/api`;


export const fetchAllList = async (
    userId: string,
): Promise<void> => {
    try {
        const taskLists = await getAllLists(userId); // Fetch the lists from the backend
        if (taskLists && taskLists.data && taskLists.data.lists) {
            // Ensure taskLists.data.lists is an array and map over it to extract the 'name' property
            const listIdsAndNames = taskLists.data.lists.map(list => ({
                name: list.name,
                id: list.listId
            }));
            //setListIdsNames(listIdsAndNames);
            const listNames = listIdsAndNames.map(list => (list.name));
            console.log(listNames);
        //    setLists(listNames); // Update the state with the new array of names
        }
    } catch (e) {
        console.error('Failed to fetch lists:', e);
    }
};

export const addNewList = async (
    listName: string,
    userId: string,
    lists: string[],
    setLists: React.Dispatch<React.SetStateAction<string[]>>,
    createList: (list: TaskList) => Promise<void>
): Promise<void> => {
    if (!listName) {
        console.error('List name cannot be empty.');
        return;
    }

    const newTaskList: TaskList = {
        name: listName,
        userId: userId,
        listId: '', // Backend will assign this
    };

    const updatedLists = [...lists, listName];
    setLists(updatedLists);

    try {
        await createList(newTaskList); // Save new list in the backend
        fetchAllList(userId);
    } catch (e) {
        console.error('Failed to add new list:', e);
        setLists(lists); // Rollback state in case of error
    }
};

export const deleteList = async (listId: string) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('No token found in session storage');
        throw new Error('Unauthorized');
    }

    return await axios.delete(`${ API_BASE_URL_ }/list/deletelist`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: { listId },
    });
};
