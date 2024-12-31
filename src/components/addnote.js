import React, { useState } from 'react';
import './AddNote.css'; // Import the CSS file for styling

const AddNote = () => {
    const [noteType, setNoteType] = useState('driver');
    const [idLabel, setIdLabel] = useState('Driver ID');
    const [idValue, setIdValue] = useState('');
    const [noteHeading, setNoteHeading] = useState('');
    const [noteContent, setNoteContent] = useState('');

    const handleNoteTypeChange = (e) => {
        const selectedType = e.target.value;
        setNoteType(selectedType);
        setIdLabel(selectedType === 'driver' ? 'Driver ID' : 'Vehicle Number');
        setIdValue(''); // Reset idValue when type changes
    };

    const handleIdChange = (e) => {
        setIdValue(e.target.value);
    };

    const handleNoteContentChange = (e) => {
        setNoteContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = noteType === 'driver' ? 'drivers' : 'vehicles';
            const response = await fetch(`http://localhost:5000/api/notes/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: idValue,
                    noteContent: noteContent,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Note added successfully:', result);
                // Reset fields after submission
                setIdValue('');
                setNoteContent('');
            } else {
                console.error('Failed to add note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <div className="add-note-container">
            <h2>ADD NOTE</h2>
            <form onSubmit={handleSubmit}>
                <div className="add-radio-buttons">
                    <label>
                        <input
                            type="radio"
                            value="driver"
                            checked={noteType === 'driver'}
                            onChange={handleNoteTypeChange}
                        />
                        Driver
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="vehicle"
                            checked={noteType === 'vehicle'}
                            onChange={handleNoteTypeChange}
                        />
                        Vehicle
                    </label>
                </div>

                <div className="add-form-field-row">
                    <div className="add-form-field-column">
                        <label>{idLabel}</label>
                        <input
                            type="text"
                            value={idValue}
                            onChange={handleIdChange}
                            className="add-input"
                            required
                        />
                    </div>
                </div>

                <div className="add-form-field">
                    <label>Note Content</label>
                    <textarea
                        value={noteContent}
                        onChange={handleNoteContentChange}
                        className="add-textarea"
                        required
                    />
                </div>

                <button type="submit" className="c-submit-button">Submit</button>
            </form>
        </div>
    );
};

export default AddNote;
