import React, { useEffect, useState } from 'react';
import './Trips.css';
import carImage from '../assets/images/car2.jpeg';

function Trips() {
    const [trips, setTrips] = useState([]);
    const [currentTripIndex, setCurrentTripIndex] = useState(0);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await fetch('https://fleetmanager-manager.onrender.com/api/trips');
            const tripsData = await response.json();
            setTrips(tripsData);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        }
    };

    const handleNextTrip = () => {
        setCurrentTripIndex((prevIndex) => (prevIndex + 1) % trips.length);
    };

    const handlePreviousTrip = () => {
        setCurrentTripIndex((prevIndex) => (prevIndex - 1 + trips.length) % trips.length);
    };

    const TripDetails = ({ trip }) => {
        const [carName, setCarName] = useState('');

        useEffect(() => {
            const fetchVehicleData = async () => {
                try {
                    const response = await fetch(`https://fleetmanager-manager.onrender.com/api/vehicles?vehicleNumber=${trip.vehicleNumber}`);
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

        const determineTripCategory = (tripEndDate) => {
            const currentDate = new Date();
            const tripDateObj = new Date(tripEndDate);

            if (tripDateObj < currentDate) {
                return 'PAST';
            } else if (tripDateObj.toDateString() === currentDate.toDateString()) {
                return 'PRESENT';
            } else {
                return 'FUTURE';
            }
        };

        const tripCategory = determineTripCategory(trip.tripDate);

        return (
            <div className="trip-details">
                <p className='trip-type'>{tripCategory} TRIP</p>
                <h3 className='destination'>{carName}</h3>
                <p className='time'>{new Date(trip.tripDate).toLocaleDateString()}</p>
                <p className='date'>{trip.tripStartTime} - {trip.tripEndTime}</p>
            </div>
        );
    };

    return (
        <div className='trips-container'>
            <div className="trips-info">
                <h2>TRIPS</h2>
                <p> </p>
                <p> </p>
            </div>
            <div className="trip-display">
                <div className="car-image">
                    <div className="arrow left-arrow" onClick={handlePreviousTrip}>&lt;</div>
                    <img src={carImage} alt="Car" />
                    {trips.length > 0 && <TripDetails trip={trips[currentTripIndex]} />}
                    <div className="arrow right-arrow" onClick={handleNextTrip}>&gt;</div>
                </div>
            </div>
        </div>
    );
}

export default Trips;
