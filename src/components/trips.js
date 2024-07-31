import React, { useEffect, useState } from 'react';
import './Trips.css';
import carImage from '../assets/images/car2 (1).jpeg'; // Import the static image

function Trips() {
    const [pastTrip, setPastTrip] = useState(null);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [futureTrip, setFutureTrip] = useState(null);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/trips');
            const trips = await response.json();
            const now = new Date();

            const past = [];
            const current = [];
            const future = [];

            trips.forEach(trip => {
                const tripStartDate = new Date(trip.tripDate);
                const tripEndDate = new Date(trip.tripEndDate);
                if (tripEndDate < now) {
                    past.push(trip);
                } else if (tripStartDate <= now && (!tripEndDate || tripEndDate >= now)) {
                    current.push(trip);
                } else if (tripStartDate > now) {
                    future.push(trip);
                }
            });

            if (past.length > 0) setPastTrip(past[0]);
            if (current.length > 0) setCurrentTrip(current[0]);
            if (future.length > 0) setFutureTrip(future[0]);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        }
    };

    const TripCard = ({ trip, category }) => {
        const [carName, setCarName] = useState('');

        useEffect(() => {
            const fetchVehicleData = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/vehicles?vehicleNumber=${trip.vehicleNumber}`);
                    const [vehicle] = await response.json();
                    if (vehicle) {
                        setCarName(vehicle.vehicleName);
                    }
                } catch (error) {
                    console.error('Failed to fetch vehicle data:', error);
                }
            };
            fetchVehicleData();
        }, [trip.vehicleNumber]);

        return (
            <div className="trip">
                <div className="trip-image" style={{ backgroundImage: `url(${carImage})` }}>
                    <div className="add-button">+</div>
                    <p className='trip-type'>{category.toUpperCase()} TRIP</p>
                    <h3 className='destination'>{carName}</h3>
                    <p className='time'>{new Date(trip.tripDate).toLocaleDateString()}</p>
                    <p className='date'>{trip.tripStartTime} - {trip.tripEndTime}</p>
                </div>
            </div>
        );
    };

    return (
        <div className='legend'>
            <div className="trips">
                <div className="trip-navigation">
                    <h2>TRIPS</h2>
                    <span className="future-trips">FUTURE TRIPS</span>
                    <span className="past-trips">PAST TRIPS</span>
                </div>
                <div className="trip-container">
                    {pastTrip && <TripCard trip={pastTrip} category="Past" />}
                    {currentTrip && <TripCard trip={currentTrip} category="Current" />}
                    {futureTrip && <TripCard trip={futureTrip} category="Future" />}
                </div>
                <div className="trip-description">
                </div>
            </div>
        </div>
    );
}

export default Trips;
