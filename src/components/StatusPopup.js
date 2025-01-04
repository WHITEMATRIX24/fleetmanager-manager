import React, { useState } from 'react';
import './StatusPopup.css'; // Create and import the CSS file for styling

const StatusPopup = ({ onClose }) => {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const checkStatus = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/vehicles?vehicleNumber=${vehicleNumber}`);
            const data = await response.json();

            if (data.length > 0 && data[0].vehicleLocation) {
                const { latitude, longitude } = data[0].vehicleLocation;

                // Fetch the place name using Nominatim API
                const geocodingResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const geocodingData = await geocodingResponse.json();

                if (geocodingData.address) {
                    const placeName = geocodingData.display_name;
                    setStatusMessage(`Vehicle Location: ${placeName}`);
                } else {
                    setStatusMessage('Vehicle location found, but unable to fetch place name');
                }
            } else {
                setStatusMessage('Vehicle not found or location not set');
            }
        } catch (error) {
            setStatusMessage('Error checking status');
        }
    };



    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>CHECK VEHICLE LOCATION</h2>
                <input
                    type="text"
                    value={vehicleNumber}
                    className='c-input-field-s'
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="Enter Vehicle Number"
                />
                <button className='c-submit-button-s' onClick={checkStatus}>Check Location</button>
                {statusMessage && <p>{statusMessage}</p>}
            </div>
        </div>
    );
};

export default StatusPopup;
