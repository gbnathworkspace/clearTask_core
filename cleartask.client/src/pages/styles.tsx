import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'relative',           // Relative to the viewport
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f4f4f9'
    },
    relativediv: {
        position: 'absolute',           // Absolute position to center in the container
        top: '50%',                     // Moves it 50% from the top of the container
        left: '50%',                    // Moves it 50% from the left of the container
        transform: 'translate(-50%, -50%)', // Centers the form perfectly
        height: 'auto',                 // Allow the height to adapt to content
        width: '300px',                 // Fixed width for the form
        backgroundColor: '#b4d9d9',     // Light teal background
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    formBox: {
        margin: '10px ',
        padding: '10px',
        width: '85%',                  // Full width for input fields
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        backgroundColor: '#3e464a',

    },
    RegisterButton: {
        marginTop: '15px',
        padding: '10px 20px',
        backgroundColor: '#13726a',      // Button color
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'block',
        width: '100%',                   // Full width of the button
        textAlign: 'center',
    }
}

export default styles;