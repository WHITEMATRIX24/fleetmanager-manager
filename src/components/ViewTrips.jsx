import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import axios from 'axios';
import './ViewTrip.css';
import TripPopupForm from './TripPopupForm';
import './StatusPopup.css';
import { faArrowRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ViewTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true); // New state for loading
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedEditTrip, setSelectedEditTrip] = useState(null);
    const [extendDate, setExtendDate] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Fetch all trips from the API
        axios.get('http://localhost:5000/api/allTrips')
            .then(response => {
                setTrips(response.data);
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(error => {
                console.error('Error fetching trips:', error);
                setLoading(false); // Set loading to false even if there's an error
            });
    }, []);

    const handleExtendClick = (trip) => {
        setSelectedTrip(trip);
        console.log(trip);
    };
    const handleEditClick = (trip) => {
        setSelectedEditTrip(trip);
        setShowPopup(true);
    };
    const handleSubmitForm = (formData) => {
        console.log(formData);
        handleClosePopup();
    };
    const handleClosePopup = () => {
        setSelectedTrip(null);
        setShowPopup(false);
    };

    const handleSubmit = async () => {
        if (!extendDate) {
            alert('Please select a date to extend the trip.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/trips/${selectedTrip._id}/extend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tripEndDate: extendDate }),

            });
            if (response.ok) {
                alert('Trip extended successfully');
                setSelectedTrip(null);
                console.log(extendDate);
                setExtendDate('');
            } else {
                console.error('Error extending trip:', response.statusText);
            }
        } catch (error) {
            console.error('Error extending trip:', error);
        }
    };

    const formatLocation = (start, end) => {
        const formattedStart = start.split(',')[0];
        const formattedEnd = end.split(',')[0];
        return `${formattedStart} to \n ${formattedEnd}`;
    };

    const formatDates = (startDate, endDate) => {
        const formattedStart = new Date(startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
        const formattedEnd = new Date(endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
        return `${formattedStart} - \n ${formattedEnd}`;
    };

    return (
        <div className='view-trip-main'>
            <Sidebar />
            <div className="view-trip-content">
                <h2 className='view-trip-h2'>ALL TRIPS</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="view-trip-table">

                        <table>
                            <thead>
                                <tr>
                                    <th>Trip Number</th>
                                    <th>Driver ID</th>
                                    <th>Vehicle Number</th>
                                    <th>Trip Dates</th>
                                    <th>Locations</th>
                                    <th>Trip Type</th>
                                    <th>Remuneration Type</th>
                                    <th>Remuneration</th>
                                    <th>Extend Trip</th>
                                    <th>Edit Trip</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.map((trip) => (
                                    <tr key={trip._id}>
                                        <td>{trip.tripNumber}</td>
                                        <td>{trip.driverId}</td>
                                        <td>{trip.vehicleNumber}</td>
                                        <td style={{ whiteSpace: 'pre-line' }}>{formatDates(trip.tripDate, trip.tripEndDate)}</td>
                                        <td style={{ whiteSpace: 'pre-line' }}>{formatLocation(trip.tripStartLocation, trip.tripDestination)}</td>
                                        <td>{trip.tripType}</td>
                                        <td>{trip.remunarationType}</td>
                                        <td>{trip.tripRemunaration}</td>
                                        <td>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <button onClick={() => handleExtendClick(trip)}>
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <button onClick={() => handleEditClick(trip)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                )}
                {showPopup && (
                    <TripPopupForm
                        trip={selectedEditTrip}
                        onSubmit={handleSubmitForm}
                        onClose={handleClosePopup}
                    />
                )}
                {selectedTrip && (
                    <div className="popup-form-overlay-veh" onClick={() => setSelectedTrip(null)}>
                        <div className="popup-form-container-veh" onClick={(e) => e.stopPropagation()}>
                            <h2>Extend Trip</h2>
                            <form className="popup-form-veh">
                                <div className="popup-form-field-row">
                                    <div className="popup-form-field-column">
                                        <label>Extend Trip Upto:</label>
                                        <input
                                            type="date"
                                            className="popup-input-field"
                                            style={{ width: "80%" }}
                                            value={extendDate}
                                            onChange={(e) => setExtendDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="popup-buttons">
                                    <button
                                        className="popup-submit-button"
                                        type="button"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className="popup-submit-button"
                                        type="button"
                                        onClick={() => setSelectedTrip(null)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
}

export default ViewTrips;
