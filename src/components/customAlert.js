import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ message, onClose }) => {
    console.log('CustomAlert rendered with message:', message);
    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert-container">
                <span className="custom-alert-close" onClick={onClose}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default CustomAlert;
