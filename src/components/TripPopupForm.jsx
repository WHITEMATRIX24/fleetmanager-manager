import React, { useState, useEffect } from 'react';
import './popupform.css';

function TripPopupForm({ trip, onClose, onSubmit }) {
    const [tripNumber, setTripNumber] = useState('');
    const [driverId, setDriverId] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [tripStartLocation, setTripStartLocation] = useState('');
    const [tripDestination, setTripDestination] = useState('');
    const [tripDate, setTripDate] = useState('');
    const [tripEndDate, setTripEndDate] = useState('');
    const [tripType, setTripType] = useState('');
    const [remunarationType, setRemunerationType] = useState('');
    const [tripRemunaration, setTripRemuneration] = useState('');

    useEffect(() => {
        if (trip) {
            setTripNumber(trip.tripNumber || '');
            setDriverId(trip.driverId || '');
            setVehicleNumber(trip.vehicleNumber || '');
            setTripStartLocation(trip.tripStartLocation || '');
            setTripDestination(trip.tripDestination || '');
            setTripDate(trip.tripDate ? new Date(trip.tripDate).toISOString().split('T')[0] : '');
            setTripEndDate(trip.tripEndDate ? new Date(trip.tripEndDate).toISOString().split('T')[0] : '');
            setTripType(trip.tripType || '');
            setRemunerationType(trip.remunarationType || '');
            setTripRemuneration(trip.tripRemunaration || '');
        }
    }, [trip]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedTrip = {
            id: trip._id,
            tripNumber,
            driverId,
            vehicleNumber,
            tripStartLocation,
            tripDestination,
            tripDate,
            tripEndDate,
            tripType,
            remunarationType,
            tripRemunaration,
        };
        try {
            const response = await fetch(`http://localhost:5000/api/trips/updateTrip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTrip),
            });
            if (response.ok) {
                alert('Trip updated successfully!');
                onSubmit(updatedTrip);
                onClose();
            } else {
                const errorText = await response.text();
                alert(`Error updating trip: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="popup-form-overlay">
            <div className="popup-form-container">
                <span className="close-popup" onClick={onClose}>&times;</span>
                <form className="popup-form" onSubmit={handleSubmit}>
                    <h2>Edit Trip Details</h2>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="tripNumber">Trip Number</label>
                            <input
                                type="text"
                                id="tripNumber"
                                value={tripNumber}
                                className="popup-input-field"
                                onChange={(e) => setTripNumber(e.target.value)}
                                required
                                disabled
                            />
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="driverId">Driver ID</label>
                            <input
                                type="text"
                                id="driverId"
                                value={driverId}
                                className="popup-input-field"
                                onChange={(e) => setDriverId(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="vehicleNumber">Vehicle Number</label>
                            <input
                                type="text"
                                id="vehicleNumber"
                                value={vehicleNumber}
                                className="popup-input-field"
                                onChange={(e) => setVehicleNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="tripType">Trip Type</label>
                            <input
                                type="text"
                                id="tripType"
                                value={tripType}
                                className="popup-input-field"
                                onChange={(e) => setTripType(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="tripStartLocation">Start Location</label>
                            <input
                                type="text"
                                id="tripStartLocation"
                                value={tripStartLocation}
                                className="popup-input-field"
                                onChange={(e) => setTripStartLocation(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="tripDestination">Destination</label>
                            <input
                                type="text"
                                id="tripDestination"
                                value={tripDestination}
                                className="popup-input-field"
                                onChange={(e) => setTripDestination(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="tripDate">Start Date</label>
                            <input
                                type="date"
                                id="tripDate"
                                value={tripDate}
                                className="popup-input-field"
                                onChange={(e) => setTripDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="tripEndDate">End Date</label>
                            <input
                                type="date"
                                id="tripEndDate"
                                value={tripEndDate}
                                className="popup-input-field"
                                onChange={(e) => setTripEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="remunerationType">Remuneration Type</label>
                            <input
                                type="text"
                                id="remunerationType"
                                value={remunarationType}
                                className="popup-input-field"
                                onChange={(e) => setRemunerationType(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="tripRemuneration">Remuneration</label>
                            <input
                                type="text"
                                id="tripRemuneration"
                                value={tripRemunaration}
                                className="popup-input-field"
                                onChange={(e) => setTripRemuneration(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="popup-submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default TripPopupForm;
