import React, { useState } from 'react';
import './notification.css';

function Notification({ notifications, handleRemoveNotification, showPopup, setShowPopup }) {
    const [currentPage, setCurrentPage] = useState(0);
    const notificationsPerPage = 8;

    const handleMoreClick = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const startIndex = currentPage * notificationsPerPage;
    const displayedNotifications = notifications.slice(startIndex, startIndex + notificationsPerPage);

    return (
        showPopup && (
            <div className="notifications-popup">
                <div className="popup-header">
                    <h2>NOTIFICATIONS</h2>
                    <button className="close-popup" onClick={() => setShowPopup(false)}>x</button>
                </div>
                <ul>
                    {displayedNotifications.map((notification, index) => (
                        <li key={index}>
                            {notification} <button className='no-popup' onClick={() => handleRemoveNotification(startIndex + index)}>x</button>
                        </li>
                    ))}
                </ul>
                {startIndex + notificationsPerPage < notifications.length && (
                    <button className="more-button" onClick={handleMoreClick}>More</button>
                )}
            </div>
        )
    );
}

export default Notification;
