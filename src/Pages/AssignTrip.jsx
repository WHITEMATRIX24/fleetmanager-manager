import React, { useState, useEffect } from 'react'
import './AddVehicle.css'
import './AssignTrip.css'
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Identity } from '../assets/images/id-card-svgrepo-com.svg';
import { ReactComponent as ServiceIcon } from '../assets/images/car-repairing-svgrepo-com.svg'
import { ReactComponent as GarageIcon } from '../assets/images/car-garage-vehicle-svgrepo-com.svg'
import { ReactComponent as CarFav } from '../assets/images/car-svgrepo-com.svg';
import LocationInput from '../components/LocationInput';
import SuccessPopup from '../components/SuccessPopup';
import TripPopup from '../components/TripPopup';



function AssignTrip() {
    const [showSucessTripPopup, setShowSucessTripPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [tripCount, setTripCount] = useState(0);
    const [lastTripID, setLastTripID] = useState(null);
    const [newTripNumber, setNewTripNumber] = useState('');
    const [showTripPopup, setShowTripPopup] = useState(false);
    const navigate = useNavigate();
    const [tripData, setTripData] = useState({
        tripStartLocation: '',
        tripDestination: '',
        vehicleNumber: '',
        driverId: '',
        tripDate: '',
        tripEndDate: '',
        tripType: '',
        odometerReading: '',
        remunarationType: '',
        tripRemunaration: '',
    });
    const [carCounts, setCarCounts] = useState({
        onTrip: 0,
        inYard: 0,
        inWorkshop: 0,
    });
    const getCarCounts = async () => {
        try {
            const counts = await fetchCarCounts();
            setCarCounts(counts);
        } catch (error) {
            console.error('Error in getCarCounts:', error);
            // Handle error state or retries if needed
            setCarCounts({ onTrip: 0, inYard: 0, inWorkshop: 0 });
        }
    };

    useEffect(() => {
        getCarCounts();
    }, []);
    const fetchCarCounts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vehicles');
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const contentType = response.headers.get('content-type');
            console.log('Content Type:', contentType);

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.log('Response Text:', textResponse);
                throw new Error('Response is not JSON');
            }

            const vehicles = await response.json();
            console.log('Vehicles Data:', vehicles);

            // Process vehicles data as needed
            const counts = {
                onTrip: 0,
                inYard: 0,
                inWorkshop: 0,
            };

            vehicles.forEach(vehicle => {
                if (vehicle.vehicleStatus === 'On Trip') {
                    counts.onTrip += 1;
                } else if (vehicle.vehicleStatus === 'In Garage') {
                    counts.inYard += 1;
                } else if (vehicle.vehicleStatus === 'In Workshop') {
                    counts.inWorkshop += 1;
                }
            });

            return counts;
        } catch (error) {
            console.error('Error fetching car counts:', error);
            return { onTrip: 0, inYard: 0, inWorkshop: 0 };
        }
    };
    const handleTripChange = (e) => {
        const { name, value } = e.target;
        setTripData({
            ...tripData,
            [name]: value,
        });
    };
    const fetchLastTripID = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/lastTripID');
            const data = await response.json();
            setLastTripID(data.lastTripID);
        } catch (error) {
            console.error('Error fetching last trip ID:', error);
        }
    };
    useEffect(() => {
        const fetchTripCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tripCount');
                const data = await response.json();
                setTripCount(data.count);
            } catch (error) {
                console.error('Error fetching trip count:', error);
            }
        };
        fetchTripCount();
    }, []);

    // const generateTripNumber = () => {
    //     const newTripNumber = `TR${String(tripCount).padStart(3, '0')}`;
    //     setTripData((prevData) => ({ ...prevData, tripNumber: newTripNumber }));
    //     setTripCount(tripCount + 1);
    // };
    const generateTripNumber = async () => {
        let tempID = lastTripID ? parseInt(lastTripID.replace('TR', ''), 10) + 1 : 1;
        let uniqueTripID = `TR${String(tempID).padStart(3, '0')}`;

        try {
            let exists = true;
            while (exists) {
                const response = await fetch(`http://localhost:5000/api/checkTripID/${uniqueTripID}`);
                if (!response.ok) {
                    throw new Error(`Failed to check trip ID. Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.exists) {
                    tempID++;
                    uniqueTripID = `TR${String(tempID).padStart(3, '0')}`;
                } else {
                    exists = false;
                }
            }
            setNewTripNumber(uniqueTripID);
            console.log(uniqueTripID);
            setTripData((prevData) => ({ ...prevData, tripNumber: newTripNumber }));
        } catch (error) {
            console.error('Error generating trip ID:', error);
        }
    };
    useEffect(() => {
        fetchLastTripID();
    }, []);
    const handleTripSubmit = async (e) => {
        e.preventDefault();

        // Generate trip number
        const newTripNumber = generateTripNumber();

        // Include latitude and longitude for start location and destination
        const tripDataWithLatLng = {
            ...tripData,
            tripNumber: newTripNumber,
            tripStartLatLng: {
                lat: tripData.tripStartLatLng?.lat || null,
                lng: tripData.tripStartLatLng?.lng || null,
            },
            tripDestinationLatLng: {
                lat: tripData.tripDestinationLatLng?.lat || null,
                lng: tripData.tripDestinationLatLng?.lng || null,
            },
        };

        try {
            const response = await fetch('http://localhost:5000/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripDataWithLatLng),
            });

            if (response.ok) {
                setPopupMessage('Trip added successfully!');
                setShowSucessTripPopup(true);
                const result = await response.json();
                console.log('Trip assigned successfully:', result);

                // Reset form after successful submission
                setTripData({
                    tripStartLocation: '',
                    tripStartLatLng: null,
                    tripDestination: '',
                    tripDestinationLatLng: null,
                    vehicleNumber: '',
                    driverId: '',
                    tripDate: '',
                    tripEndDate: '',
                    tripType: '',
                    odometerReading: '',
                    remunarationType: '',
                    tripRemunaration: '',
                });

                setTripCount(tripCount + 1); // Increment trip count
            } else {
                const errorResponse = await response.json();
                if (errorResponse.error) {
                    alert(errorResponse.error); // Show an alert box with the error message
                } else {
                    alert('Failed to assign trip. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error assigning trip:', error);
            alert('An error occurred while assigning the trip. Please try again later.');
        }
    };
    const handleViewTripClick = () => {
        navigate('/viewtrip');
    };

    return (
        <div className="vehicle">
            <div className="contents">
                <div className="left">
                    <div class="add-trip">
                        <div class="form-container">
                            <form className="c-form-car" onSubmit={handleTripSubmit}>
                                <div className="header-form">
                                    <h2 className="c-form-trip-header">ASSIGN TRIP</h2>
                                </div>
                                <div className="c-form-field-row-trip">

                                    <div className="c-form-field-column-50-trip">
                                        <label htmlFor="vehicleNumber">Car Number</label>
                                        <input
                                            type="text"
                                            name="vehicleNumber"
                                            id="vehicleNumber"
                                            placeholder="Vehicle Number"
                                            className="c-input-field-trip"
                                            value={tripData.vehicleNumber}
                                            onChange={handleTripChange}
                                        />
                                    </div>
                                    <div className="c-form-field-column-50-trip">
                                        <label htmlFor="driverId">Driver ID</label>
                                        <input
                                            type="text"
                                            name="driverId"
                                            id="driverId"
                                            placeholder="Driver ID"
                                            className="c-input-field-trip"
                                            value={tripData.driverId}
                                            onChange={handleTripChange}
                                        />
                                    </div>
                                </div>
                                <div className="c-form-field-row-trip">
                                    <div className="c-form-field-column-50-trip">
                                        <label htmlFor="tripStartLocation">Trip Start Location</label>
                                        <LocationInput
                                            id="tripStartLocation"
                                            onSelectAddress={(address, latLng) => {
                                                setTripData((prev) => ({
                                                    ...prev,
                                                    tripStartLocation: address,
                                                    tripStartLatLng: latLng,
                                                }));
                                            }}
                                        />

                                    </div>
                                    <div className="c-form-field-column-50-trip">
                                        <label htmlFor="tripDestination">Trip Destination</label>
                                        <LocationInput
                                            id="tripDestination"
                                            onSelectAddress={(address, latLng) => {
                                                setTripData((prev) => ({
                                                    ...prev,
                                                    tripDestination: address,
                                                    tripDestinationLatLng: latLng,
                                                }));
                                            }}
                                        />
                                    </div>

                                </div>
                                <div className="c-form-field-row-trip">
                                    <div className="c-form-field-column-trip" style={{ width: '33%' }}>
                                        <label htmlFor="tripDate">Trip Start Date</label>
                                        <input
                                            type="datetime-local"
                                            name="tripDate"
                                            id="tripDate"
                                            className="c-input-field-trip"
                                            value={tripData.tripDate}
                                            onChange={handleTripChange}
                                        />
                                    </div>
                                    <div className="c-form-field-column-trip" style={{ width: '33%' }}>
                                        <label htmlFor="tripEndDate">Trip End Date</label>
                                        <input
                                            type="date"
                                            name="tripEndDate"
                                            id="tripEndDate"
                                            placeholder="Trip End Date"
                                            className="c-input-field-trip"
                                            value={tripData.tripEndDate}
                                            onChange={handleTripChange}
                                        />
                                    </div>
                                    <div className="c-form-field-column-trip" style={{ width: '33%' }}>
                                        <label htmlFor="tripType">Trip Type</label>
                                        <select
                                            name="tripType"
                                            id="tripType"
                                            className="c-input-field-trip"
                                            value={tripData.tripType}
                                            onChange={handleTripChange}
                                        >
                                            <option value="">Select Trip Type</option>
                                            <option value="Revenue">Revenue</option>
                                            <option value="Non revenue">Non Revenue</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="c-form-field-row-trip">
                                    <div className="c-form-field-column-50-trip">
                                        <label htmlFor="remunarationType">Remuneration Type</label>
                                        <select
                                            name="remunarationType"
                                            id="remunarationType"
                                            className="c-input-field-trip"
                                            value={tripData.remunarationType}
                                            onChange={handleTripChange}
                                        >
                                            <option value="">Select Remuneration Type</option>
                                            <option value="Fully paid">Fully Paid</option>
                                            <option value="Pay after trip">Pay After Trip</option>
                                            <option value="Advance paid">Advance Paid</option>
                                        </select>
                                    </div>
                                    <div className="c-form-field-column-50-trip">
                                        <label htmlFor="tripRemunaration">Remuneration</label>
                                        <input
                                            type="text"
                                            name="tripRemunaration"
                                            id="tripRemunaration"
                                            placeholder="Remuneration"
                                            className="c-input-field-trip"
                                            value={tripData.tripRemunaration}
                                            onChange={handleTripChange}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="c-submit-button">Submit</button>
                            </form>
                            {showSucessTripPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSucessTripPopup(false)} />}
                        </div>
                    </div>

                </div>
                <div className="right">
                    <div>
                        <button className="ccard-button" onClick={handleViewTripClick}>
                            <div style={{ margin: 'auto', display: 'flex' }}>
                                <div className="iicon-container">
                                    <Identity className="iicon" />

                                </div>
                                <div className="text-container">
                                    <span className="count">EXTEND</span>
                                    <span className="label">Trips</span>
                                </div>
                            </div>
                        </button>

                        {showTripPopup && <TripPopup onClose={() => setShowTripPopup(false)} />}
                    </div>

                    <button className="ccard-button">
                        <div style={{ margin: 'auto', display: 'flex' }}>
                            <div className="iicon-container">
                                <CarFav className='iicon' />
                            </div>
                            <div className="text-container">
                                <span className="count">{carCounts.onTrip}</span>
                                <span className="label">Cars on Trip</span>
                            </div>
                        </div>
                    </button>

                    <button className="ccard-button">
                        <div style={{ margin: 'auto', display: 'flex' }}>
                            <div className="iicon-container">
                                <GarageIcon className='iicon' />
                            </div>
                            <div id="workshop" className="text-container">
                                <span className="count">{carCounts.inYard}</span>
                                <span className="label">Cars in Yard</span>
                            </div>
                        </div>
                    </button>
                    <button className="ccard-button">
                        <div style={{ margin: '35px', display: 'flex' }}>
                            <div className="iicon-container">
                                <ServiceIcon />
                            </div>
                            <div className="text-container">
                                <span className="count">{carCounts.inWorkshop}</span>
                                <span className="label">Cars in Workshop</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AssignTrip