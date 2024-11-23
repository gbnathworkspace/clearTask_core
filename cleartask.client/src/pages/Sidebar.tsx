import React, { useState } from 'react';
import '../styles/Sidebar.css'; // Import the Sidebar styles
import { getAllLists, createList, TaskList } from '../services/taskService';

interface SidebarProps {
    selectedList: string;
    setSelectedList: (list: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedList, setSelectedList }) => {
    const [lists, setLists] = useState<string[]>([]);
    const userId = sessionStorage.getItem('userid') || '';

    const fetchAllList = async () => {
        try {
            const taskLists = await getAllLists(userId); // Fetch the lists from the backend
            if (taskLists && taskLists.data && taskLists.data.lists) {
                // Ensure taskLists.data.lists is an array and map over it to extract the 'name' property
                const listNames = taskLists.data.lists.map(list => list.name);
                console.log(listNames);
                setLists(listNames); // Update the state with the new array of names
            }
        } catch (e) {
            console.log(e); // Proper error logging
        }
    }



    const handleListClick = (list: string) => {
        setSelectedList(list);
        fetchAllList();
    };



    const handleNewList = async () => {
        const listName = prompt('Enter a new list name:') || '';

        const newTaskList: TaskList = {
            name: listName,
            userId: userId,
            listId: ''
        }

        if (listName) {
            const updatedLists = [...lists, listName];
            setLists(updatedLists);
            try {
                await createList(newTaskList); // Assuming there's a function to add to backend
                fetchAllList(); // Refresh lists after adding
            } catch (e) {
                console.error('Failed to add new list:', e);
            }
        }
    };


    return (
        <div className="sidebar">
            <h3>Lists</h3>
            <ul className="list-items">
                {lists.map((list) => (
                    <li
                        key={list}
                        className={selectedList === list ? 'active-list' : ''}
                        onClick={() => handleListClick(list)}
                    >
                        {list}
                    </li>
                ))}
            </ul>
            <button className="new-list-button" onClick={handleNewList}>
                New List
            </button>
        </div>
    );
};

export default Sidebar;
