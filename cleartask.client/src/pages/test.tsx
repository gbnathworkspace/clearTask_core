import React, { useState } from 'react';
import { API_URL } from '../services/authService.ts';
import '../styles/gen.css';

const NewPage:React.FC = () => {
    const [count, setCount] = useState(0); 
    const [text, setText] = useState('');
    const [ showText, setShowText] = useState(false);
    const [ characterCount, setCharacterCount] = useState(0);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        setText(event.target.value);
        setCharacterCount(event.target.value.length);
    }

    return (
        <div className='center'>
            <div className='center-text'>
                {  showText && <h1 className='center-text'> AK RED DRAGON </h1>}
            </div>
            <button onClick={() => setShowText(!showText)} > show/hide</button>


            <p>The color is Red</p>
            <p>the Token is {API_URL}</p>
            <p>the Count is {count}</p>
            <button onClick={() => setCount(count + 1)}></button>

            <h1>WelcomeTo the Test Page</h1>
            <p> some test cases </p>

            <input onChange={handleInputChange}/>
            <p>pls enter : {characterCount}</p>
        </div>
    );
};

export default NewPage;