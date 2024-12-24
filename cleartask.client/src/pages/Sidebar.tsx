import React, { useState, useEffect } from 'react';
import '../styles/Sidebar.css'; // Import the Sidebar styles
import { getAllLists, createList, TaskList } from '../services/taskService';
import { deleteList } from '../services/listService'; // Import the reusable functions
import { FiTrash } from 'react-icons/fi';

interface SidebarProps {
    selectedList: string;
    setSelectedList: (list: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedList, setSelectedList }) => {
    const [lists, setLists] = useState<TaskList[]>([]);
    const userId = sessionStorage.getItem('userid') || '';

    useEffect(() => {
        const loadLists = async () => {
            try {
                const response = await getAllLists(userId);

                if (response && response.data && Array.isArray(response.data.lists)) {
                    setLists(response.data.lists);

                    // If we have lists but none selected, select the first one
                    if (response.data.lists.length > 0 && !selectedList) {
                        const firstList = response.data.lists[0];
                        setSelectedList(firstList.listId);
                    }
                } else {
                    // Handle the case where we don't get the expected data structure
                    console.warn('Received unexpected data structure from API');
                    setLists([]); // Set to empty array as fallback
                }
            } catch (error) {
                console.error('Error loading lists:', error);
                setLists([]); // Set to empty array on error
            }
        };

        // Only load lists if we have a userId
        if (userId) {
            loadLists();
        }
    }, [userId, selectedList, setSelectedList]);

    const handleListClick = (list: string) => {
        setSelectedList(list);
    };

    const handleNewList = async () => {
        const listName = prompt('Enter a new list name:');
        if (!listName) return;

        try {
            const newList: TaskList = {
                listId: '',
                name: listName,
                userId: userId
            };
            await createList(newList);
            const response = await getAllLists(userId);
            if (response?.data?.lists) {
                setLists(response.data.lists);
            }
        } catch (error) {
            console.error('Error creating new list:', error);
        }
    };

    const handleDeleteList = async (listId: string, event: React.MouseEvent) => {
        event.stopPropagation();

        if (listId === userId) {
            alert("Cannot delete the default list!");
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this list?');
        if (!confirmDelete) return;

        try {
            await deleteList(listId);
            const response = await getAllLists(userId);
            if (response?.data?.lists) {
                setLists(response.data.lists);
                if (listId === selectedList) {
                    setSelectedList(userId);
                }
            }
        } catch (error) {
            console.error('Error deleting list:', error);
            alert('Failed to delete list');
        }
    };

    return (
        <div className="sidebar">
            <h3>Lists</h3>
            <ul className="list-items">
                {lists.map((list) => (
                    <li
                        key={list.listId}
                        className={selectedList === list.listId ? 'active-list' : ''}
                        onClick={() => handleListClick(list.listId)}
                    >
                        <span className="list-name">{list.name}</span>
                        {list.listId !== userId && (
                            <FiTrash
                                className="delete-icon"
                                onClick={(e) => handleDeleteList(list.listId, e)}
                            />
                        )}
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
