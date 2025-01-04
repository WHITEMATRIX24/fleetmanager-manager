import React, { useState, useEffect } from 'react';
import PageSidebar from './PageSidebar/PageSidebar';
import axios from 'axios';
import './ViewTrip.css';
import TripPopupForm from './TripPopupForm';
import './StatusPopup.css';
import { faArrowRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ViewTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedEditTrip, setSelectedEditTrip] = useState(null);
    const [extendDate, setExtendDate] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query

    useEffect(() => {
        axios.get('http://localhost:5000/api/allTrips')
            .then(response => {
                setTrips(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching trips:', error);
                setLoading(false);
            });
    }, []);

    const handleExtendClick = (trip) => setSelectedTrip(trip);
    const handleEditClick = (trip) => {
        setSelectedEditTrip(trip);
        setShowPopup(true);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tripEndDate: extendDate }),
            });
            if (response.ok) {
                alert('Trip extended successfully');
                setSelectedTrip(null);
                setExtendDate('');
            } else {
                console.error('Error extending trip:', response.statusText);
            }
        } catch (error) {
            console.error('Error extending trip:', error);
        }
    };

    const formatLocation = (start, end) => `${start.split(',')[0]} to \n ${end.split(',')[0]}`;
    const formatDates = (startDate, endDate) => {
        const formattedStart = new Date(startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
        const formattedEnd = new Date(endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
        return `${formattedStart} - \n ${formattedEnd}`;
    };

    const filteredTrips = trips.filter(trip =>
        trip.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='view-trip-main'>
            <PageSidebar />
            <div className="view-trip-content">
                <div className="view-trip-header">
                    <h2 className='view-trip-h2'>ALL TRIPS</h2>
                    <div className="trip-searchbar-container">
                        <input
                            type="text"
                            className="trip-searchbar"
                            placeholder="Filter by Vehicle Number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
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
                                {filteredTrips.map((trip) => (
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
                                            <button onClick={() => handleExtendClick(trip)}>
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditClick(trip)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
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
                        onSubmit={() => { }}
                        onClose={handleClosePopup}
                    />
                )}
                {selectedTrip && (
                    <div className="popup-form-overlay-veh" onClick={() => setSelectedTrip(null)}>
                        <div className="popup-form-container-veh" onClick={(e) => e.stopPropagation()}>
                            <h2>Extend Trip</h2>
                            <form>
                                <label>Extend Trip Upto:</label>
                                <input
                                    type="date"
                                    value={extendDate}
                                    onChange={(e) => setExtendDate(e.target.value)}
                                />
                                <button type="button" onClick={handleSubmit}>Submit</button>
                                <button type="button" onClick={() => setSelectedTrip(null)}>Close</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewTrips;
