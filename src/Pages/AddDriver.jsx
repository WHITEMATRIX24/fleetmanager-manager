import React, { useState, useRef, useEffect } from 'react';
import './AddVehicle.css'
import './AddDriver.css'
import { ReactComponent as Identity } from '../assets/images/id-card-svgrepo-com.svg';
import { ReactComponent as Driver } from '../assets/images/truck-driver-svgrepo-com.svg'

import SuccessPopup from '../components/SuccessPopup';
import { useNavigate } from 'react-router-dom';
import DriverNote from '../components/Drivernote';

function AddDriver() {
    const [driverCount, setDriverCount] = useState(0);
    const [driverCountID, setDriverCountID] = useState(0);
    const [showSucessDriverPopup, setShowSucessDriverPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();
    const [lastDriverID, setLastDriverID] = useState(null);
    const [newDriverID, setNewDriverID] = useState('');
    const [driverData, setDriverData] = useState({
        drivername: '',
        driverid: '',
        driverpassword: '',
        drivermobile: '',
        driverlicenceno: '',
        driverlicenceexp: '',
    });
    useEffect(() => {
        const fetchDriverCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/driverCount');
                const data = await response.json();
                setDriverCount(data.count);
                console.log(driverCount);
            } catch (error) {
                console.error('Error fetching driver count:', error);
            }
        };
        fetchDriverCount();
    }, []);
    const fetchLastDriverID = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/lastDriverID');
            const data = await response.json();
            setLastDriverID(data.lastDriverID);
            console.log(lastDriverID);
        } catch (error) {
            console.error('Error fetching last driver ID:', error);
        }
    };
    const generateDriverID = async () => {
        let tempID = lastDriverID ? parseInt(lastDriverID.replace('DR', ''), 10) + 1 : 1;
        let uniqueID = `DR${String(tempID).padStart(3, '0')}`;

        try {
            // Check if the ID already exists
            let exists = true;
            while (exists) {
                const response = await fetch(`http://localhost:5000/api/checkDriverID/${uniqueID}`);
                const data = await response.json();
                if (data.exists) {
                    tempID++;
                    uniqueID = `DR${String(tempID).padStart(3, '0')}`;
                } else {
                    exists = false;
                }
            }
            setNewDriverID(uniqueID);
            setDriverData((prevData) => ({ ...prevData, driverid: uniqueID }));
            setDriverCountID(uniqueID);
        } catch (error) {
            console.error('Error generating driver ID:', error);
        }
    };
    useEffect(() => {
        fetchLastDriverID();
    }, []);
    const handleDriverChange = (e) => {
        const { name, value, files } = e.target;
        setDriverData({
            ...driverData,
            [name]: files ? files[0] : value,
        });
    };
    const handleDriverSubmit = async (e) => {
        e.preventDefault();

        const driverData = {
            drivername: e.target.drivername.value,
            driverid: e.target.driverid.value,
            driverpassword: e.target.driverpassword.value,
            drivermobile: e.target.drivermobile.value,
            driverlicenceno: e.target.driverlicenceno.value,
            driverlicenceexp: e.target.driverlicenceexp.value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driverData),
            });

            if (response.ok) {
                setPopupMessage('Driver added successfully!');
                setShowSucessDriverPopup(true);
                setDriverData({
                    drivername: '',
                    driverid: '',
                    driverpassword: '',
                    drivermobile: '',
                    driverlicenceno: '',
                    driverlicenceexp: '',
                })
            } else {
                const errorText = await response.text();
                alert(`Error adding driver: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the driver.');
        }
    };
    const handleEditDriverDetailsClick = () => {
        navigate('/editdriver');
    };
    const handleViewAttendance = () => {
        navigate('/attendence');
    };
    return (
        <>
            <div className="vehicle">
                <div className="contents">
                    <div className="left">
                        <div class="add-car">
                            <div class="form-container-driver">
                                <form className="c-form-car" onSubmit={handleDriverSubmit}>
                                    <div className="header-form">
                                        <h2 className='c-form-car-header'>ADD A DRIVER</h2>
                                        <button
                                            type="button"
                                            className="generate-id-button"
                                            onClick={generateDriverID}
                                        >
                                            Generate Driver ID
                                        </button>
                                    </div>
                                    <div className="c-form-field-row">
                                        <div className="c-form-field-column">
                                            <label htmlFor="drivername">Driver Name</label>
                                            <input
                                                type="text"
                                                name="drivername"
                                                id="drivername"
                                                placeholder="Driver Name"
                                                className="c-input-field"
                                                value={driverData.drivername}
                                                onChange={handleDriverChange}
                                            />
                                        </div>
                                        <div className="c-form-field-column">
                                            <label htmlFor="driverid">Driver ID</label>
                                            <input
                                                type="text"
                                                name="driverid"
                                                id="driverid"
                                                placeholder="Driver ID"
                                                className="c-input-field"
                                                value={driverData.driverid}
                                                onChange={handleDriverChange}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="c-form-field-row">
                                        <div className="c-form-field-column">
                                            <label htmlFor="driverpassword">Password</label>
                                            <input
                                                type="text"
                                                name="driverpassword"
                                                id="driverpassword"
                                                placeholder="Password"
                                                className="c-input-field"
                                                value={driverData.driverpassword}
                                                onChange={handleDriverChange}
                                            />
                                        </div>
                                        <div className="c-form-field-column">
                                            <label htmlFor="drivermobile">Mobile Number</label>
                                            <input
                                                type="text"
                                                name="drivermobile"
                                                id="drivermobile"
                                                placeholder="Mobile Number"
                                                className="c-input-field"
                                                value={driverData.drivermobile}
                                                onChange={handleDriverChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="c-form-field-row">
                                        <div className="c-form-field-column">
                                            <label htmlFor="driverlicenceno">Driver Licence No</label>
                                            <input
                                                type="text"
                                                name="driverlicenceno"
                                                id="driverlicenceno"
                                                placeholder="Driver Licence Number"
                                                className="c-input-field"
                                                value={driverData.driverlicenceno}
                                                onChange={handleDriverChange}
                                            />
                                        </div>
                                        <div className="c-form-field-column">
                                            <label htmlFor="driverlicenceexp">Driver Licence Expiry</label>
                                            <input
                                                type="date"
                                                name="driverlicenceexp"
                                                id="driverlicenceexp"
                                                placeholder="Expiry DATE"
                                                className="c-input-field"
                                                value={driverData.driverlicenceexp}
                                                onChange={handleDriverChange}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="c-submit-button">Submit</button>
                                </form>
                                {showSucessDriverPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSucessDriverPopup(false)} />}
                            </div>
                        </div>

                    </div>
                    <div className="right">
                        <button className="edit-cardd-vehicle" onClick={handleEditDriverDetailsClick}>

                            <div className="iicon-container">
                                <Identity className="iicon" />
                            </div>
                            <div className="text-container">
                                <span className="count">EDIT</span>
                                <span className="label">Drivers Details</span>
                            </div>

                        </button>


                        <div id="trip"></div>
                        <DriverNote />
                        <button className="edit-cardd-vehicle" onClick={handleViewAttendance}>

                            <div className="iicon-container">
                                < Driver className="iicon" />
                            </div>
                            <div className="text-container">
                                <span className="count"> 4</span>
                                <span className="label">View Attendance</span>
                            </div>

                        </button>




                    </div>
                </div>

            </div>
        </>
    )
}

export default AddDriver
