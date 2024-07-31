import React, { useState, useEffect } from 'react';
import './SosNotification.css';

function SosNotification({ type, onClose }) {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/issues?type=${type}`);
                const data = await response.json();

                if (response.ok) {
                    setIssues(data.issues);
                } else {
                    console.error('Error fetching issues:', data.error);
                }
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };


        fetchIssues();
    }, [type]);

    const handleDelete = async (issueId) => {
        try {
            await fetch(`http://localhost:5000/api/issues/${issueId}`, { method: 'DELETE' });
            setIssues(issues.filter(issue => issue._id !== issueId));
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    return (
        <div className="sos-notification">
            <div className="sos-notification-content">
                <div className='notification-header'>
                    <h2>{type === 'sos' ? 'SOS NOTIFICATION' : 'TRIP NOTIFICATION'}</h2>
                    <button className='close-popup' onClick={onClose}>X</button>
                </div>
                <ul>
                    {issues.map((issue) => (
                        <li key={issue._id}>
                            <div>Vehicle Number: {issue.vehicleNumber}</div>
                            <div>Driver ID: {issue.driverId}</div>
                            <div>Issue Detail: {issue.issueDetail}</div>
                            <button className='more-button-sos' onClick={() => alert(issue.issueImage ? issue.issueImage : 'No image')}>View Details</button>
                            <button className='more-button-sos' onClick={() => handleDelete(issue._id)}>Delete</button>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}

export default SosNotification;
