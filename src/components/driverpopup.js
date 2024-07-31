import React, { useState, useEffect } from 'react';
import CustomAlert from './customAlert';
import './driverpopup.css';

const DriverPopupForm = ({ driver, onSubmit, onClose }) => {
    const [driverName, setDriverName] = useState("");
    const [driverId, setDriverId] = useState("");
    const [driverPassword, setDriverPassword] = useState("");
    const [driverPin, setDriverPin] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [driverLicenceNumber, setDriverLicenceNumber] = useState("");
    const [driverLicenceExpiryDate, setDriverLicenceExpiryDate] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (driver) {
            setDriverName(driver.driverName || "");
            setDriverId(driver.driverId || "");
            setDriverPassword(driver.driverPassword || "");
            setDriverPin(driver.driverPin || "");
            setMobileNumber(driver.mobileNumber || "");
            setDriverLicenceNumber(driver.driverLicenceNumber || "");
            setDriverLicenceExpiryDate(driver.driverLicenceNumber ? new Date(driver.driverLicenceExpiryDate).toISOString().split('T')[0] : "");
        }
    }, [driver]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: driver._id,
            driverName,
            driverId,
            driverPassword,
            driverPin,
            mobileNumber,
            driverLicenceNumber,
            driverLicenceExpiryDate,
        };
        try {
            const response = await fetch(`http://localhost:5000/updatedriver`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setAlertMessage('Driver updated successfully!');
                onSubmit(formData);
                onClose();
            } else {
                const errorText = await response.text();
                setAlertMessage(`Error updating driver: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Error updating driver');
        }
    };

    const closeAlert = () => {
        setAlertMessage("");
    };

    return (
        <div className="popup-form-overlay-driv">
            <div className="popup-form-container-driv">
                <span className="close-popup-driv" onClick={onClose}>&times;</span>
                <form className="popup-form-driv" onSubmit={handleSubmit}>
                    <h2>EDIT DRIVER DETAILS</h2>
                    <div className="popup-form-field-row-driv">
                        <div className="popup-form-field-column-driv" style={{ width: '25%' }}>
                            <label htmlFor="drivername">Driver Name</label>
                            <input
                                type="text"
                                name="drivername"
                                id="drivername"
                                placeholder="Driver Name"
                                className="popup-input-field-driv"
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column-driv" style={{ width: '25%' }}>
                            <label htmlFor="driverid">Driver ID</label>
                            <input
                                type="text"
                                name="driverid"
                                id="driverid"
                                placeholder="Driver ID"
                                className="popup-input-field-driv"
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                                required />
                        </div>
                        <div className="popup-form-field-column-driv" style={{ width: '25%' }}>
                            <label htmlFor="driverpin">Driver Pin</label>
                            <input
                                type="number"
                                name="driverpin"
                                id="driverpin"
                                placeholder="Pin Number"
                                className="popup-input-field-driv"
                                value={driverPin}
                                onChange={(e) => setDriverPin(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row-driv">
                        <div className="popup-form-field-column-driv" style={{ width: '50%' }}>
                            <label htmlFor="driverpassword">Password</label>
                            <input
                                type="text"
                                name="driverpassword"
                                id="driverpassword"
                                placeholder="Password"
                                className="popup-input-field-driv"
                                value={driverPassword}
                                onChange={(e) => setDriverPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column-driv" style={{ width: '50%' }}>
                            <label htmlFor="drivermobile">Mobile Number</label>
                            <input
                                type="text"
                                name="drivermobile"
                                id="drivermobile"
                                placeholder="Mobile Number"
                                className="popup-input-field-driv"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row-driv">
                        <div className="popup-form-field-column-driv" style={{ width: '50%' }}>
                            <label htmlFor="driverlicenceno">Driver Licence Number</label>
                            <input
                                type="text"
                                name="driverlicenceno"
                                id="driverlicenceno"
                                className="popup-input-field-driv"
                                placeholder="Licence Number"
                                value={driverLicenceNumber}
                                onChange={(e) => setDriverLicenceNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column-driv" style={{ width: '50%' }}>
                            <label htmlFor="driverlicenceexp">Driver Licence Expiry</label>
                            <input
                                type="date"
                                name="driverlicenceexp"
                                id="driverlicenceexp"
                                className="popup-input-field-driv"
                                value={driverLicenceExpiryDate}
                                onChange={(e) => setDriverLicenceExpiryDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="popup-submit-button-driv">Submit</button>
                </form>
                {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
            </div>
        </div>
    );
};

export default DriverPopupForm;
