import React, { useState } from 'react';
import '../styles/Sidebar.css'; // Import the Sidebar styles

interface SidebarProps {
    selectedList: string;
    setSelectedList: (list: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedList, setSelectedList }) => {
    const [lists, setLists] = useState(['Groceries', 'Todos', 'Work']);

    const handleListClick = (list: string) => {
        setSelectedList(list);
    };

    const handleNewList = () => {
        const newList = prompt('Enter a new list name:');
        if (newList) {
            setLists([...lists, newList]);
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
