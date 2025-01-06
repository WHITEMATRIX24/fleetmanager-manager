import React, { useEffect } from 'react';
import './SuccessPopup.css';

const SuccessPopup = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="popup-success show-success">
            <i className="fas fa-check-circle icon-success"></i>
            {message}
        </div>
    );
};

export default SuccessPopup;
