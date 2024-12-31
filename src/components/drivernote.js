import React, { useState } from 'react';
import notesIcon from '../assets/images/notes-svgrepo-com.svg';
import { ReactComponent as NoteIcon } from '../assets/images/notes-svgrepo-com.svg';
import './DriverNote.css';
import './dashboard.css';

const DriverNote = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [driverId, setDriverId] = useState('');
    const [noteHeading, setNoteHeading] = useState('');
    const [noteContent, setNoteContent] = useState('');

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        // Reset fields when closing popup if needed
        setDriverId('');
        setNoteHeading('');
        setNoteContent('');
    };

    const handleDriverIdChange = (e) => {
        setDriverId(e.target.value);
    };

    const handleNoteHeadingChange = (e) => {
        setNoteHeading(e.target.value);
    };

    const handleNoteContentChange = (e) => {
        setNoteContent(e.target.value);
    };

    const saveNote = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notes/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: driverId,
                    noteContent: noteContent,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Note added successfully:', result);
                // Reset fields after saving
                setDriverId('');
                setNoteHeading('');
                setNoteContent('');
                // Close popup after saving
                closePopup();
            } else {
                console.error('Failed to add note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <div className="driver-note">
            {isPopupOpen && (
                <div className="popup-form-overlay">
                    <div className="popup-form-container">
                        <span className="close-popup" onClick={closePopup}>
                            &times;
                        </span>
                        <div className="popup-form">
                            <h2>ADD NOTE ABOUT DRIVER</h2>
                            <div className="popup-form-field-row">
                                <div className="popup-form-field-column">
                                    <label>Driver ID</label>
                                    <input
                                        type="text"
                                        className="popup-input-field"
                                        placeholder="Enter Driver ID"
                                        value={driverId}
                                        onChange={handleDriverIdChange}
                                    />
                                </div>
                            </div>
                            <div className="popup-form-field-row">
                                <div className="popup-form-field-column">
                                    <label>Note Content</label>
                                    <textarea
                                        className="popup-input-field"
                                        placeholder="Enter Note Content"
                                        value={noteContent}
                                        onChange={handleNoteContentChange}
                                    />
                                </div>
                            </div>
                            <button className="popup-submit-button" onClick={saveNote}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="edit-cardd" onClick={openPopup}>
                <div className="iicon-container">
                    <NoteIcon className="iicon" />
                </div>
                <div className="text-container">
                    <span className="count">ADD</span>
                    <span className="label">Notes</span>
                </div>
            </button>
        </div>
    );
};

export default DriverNote;
