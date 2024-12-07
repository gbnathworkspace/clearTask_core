    import React, { useState, useEffect } from 'react';
    import '../styles/Sidebar.css'; // Import the Sidebar styles
    import { getAllLists, createList, TaskList } from '../services/taskService';
    import { addNewList } from '../services/listService'; // Import the reusable functions
    //import useStore from '../store';

    interface SidebarProps {
        selectedList: string;
        setSelectedList: (list: string) => void;
    }

    const Sidebar: React.FC<SidebarProps> = ({ selectedList, setSelectedList }) => {
        const [lists, setLists] = useState<TaskList[]>([]);
        //const [listIdsAndNames, setListIdsAndNames] = useState<List[]>([]);
        const userId = sessionStorage.getItem('userid') || '';

        useEffect(() => {
            const loadLists = async () => {
                try {
                    // Get the response from the API
                    const response = await getAllLists(userId);

                    // Type guard to ensure we have the data we need
                    if (response && response.data && Array.isArray(response.data.lists)) {
                        // Update lists state with the properly typed data
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
                    name: listName,
                    userId: userId,
                    listId: '', // Will be assigned by backend
                };

                await addNewList(listName, userId, lists.map(l => l.name), setLists, async (list: TaskList) => {
                    await createList(list);
                    const response = await getAllLists(userId);
                    if (response?.data?.lists) {
                        setLists(response.data.lists);
                    }
                });
            } catch (error) {
                console.error('Error creating new list:', error);
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
                            {list.name}
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
