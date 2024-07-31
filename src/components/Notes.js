import React, { useState, useEffect } from 'react';
import './Notes.css';

function NotesDisplay() {
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        // Fetch notes from the backend
        const fetchNotes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/notes');
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };
        fetchNotes();
    }, []);

    const notesPerPage = 4;
    const displayedNotes = notes.slice(currentPage * notesPerPage, (currentPage + 1) * notesPerPage);

    const handleMoreClick = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <div className='legend'>
            <div className="notes-main">
                <h2>NOTES</h2>
                {displayedNotes.map((note, index) => (
                    <div key={index} className="notes-cont">
                        <h3>{note.type === 'driver' ? `Driver ID: ${note.id}` : `Car No: ${note.id}`}</h3>
                        <p>{note.content}</p>
                    </div>
                ))}
                {displayedNotes.length > 0 && notes.length > (currentPage + 1) * notesPerPage && (
                    <div className='bbutton'>
                        <button className='c-submit-button' onClick={handleMoreClick}>More</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotesDisplay;
