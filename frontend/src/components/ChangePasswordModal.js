import React, { useState } from 'react';
import './ChangePasswordModal.css'; // Ensure this file exists with proper styling

function ChangePasswordModal({ show, onClose }) {
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    currentPassword,
                    newPassword
                }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('Password changed successfully');
                setError('');
                setUsername('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                setError(data.message);
                setSuccess('');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError('An error occurred while changing the password');
            setSuccess('');
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>CHANGE PASSWORD</h2>
                <button onClick={onClose} className='close-popup'>X</button>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <input
                    type="text"
                    className='c-input-field-s'
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className='c-input-field-s'
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    className='c-input-field-s'
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className='c-input-field-s'
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button onClick={handleSubmit} className='more-button'>Submit</button>

            </div>
        </div>
    );
}

export default ChangePasswordModal;
