import React, { useState, useEffect } from 'react';
import './popupform.css';

function PopupForm({ car, onClose, onSubmit }) {
    const [vehicleName, setVehicleName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [insuranceDueDate, setInsuranceDueDate] = useState("");
    const [istimaraDueDate, setIstimaraDueDate] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleStatus, setVehicleStatus] = useState("");

    useEffect(() => {
        if (car) {
            setVehicleName(car.vehicleName || "");
            setVehicleNumber(car.vehicleNumber || "");
            setInsuranceDueDate(car.insuranceDueDate ? new Date(car.insuranceDueDate).toISOString().split('T')[0] : "");
            setIstimaraDueDate(car.istimaraDueDate ? new Date(car.istimaraDueDate).toISOString().split('T')[0] : "");
            setVehicleType(car.vehicleType || "");
            setVehicleStatus(car.vehicleStatus || "");
        }
    }, [car]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: car._id,
            vehicleName,
            vehicleNumber,
            insuranceDueDate,
            istimaraDueDate,
            vehicleType,
            vehicleStatus,
        };
        try {
            const response = await fetch(`http://localhost:5000/api/updatevehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Vehicle updated successfully!');
                onSubmit(formData);
                onClose();
            } else {
                const errorText = await response.text();
                alert(`Error updating vehicle: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="popup-form-overlay-veh">
            <div className="popup-form-container-veh">
                <span className="close-popup-veh" onClick={onClose}>&times;</span>
                <form className="popup-form-veh" onSubmit={handleSubmit}>
                    <h2>EDIT CAR DETAILS</h2>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="vehiclename">Vehicle Name</label>
                            <input
                                type="text"
                                name="vehiclename"
                                id="vehiclename"
                                placeholder="Vehicle Name"
                                className="popup-input-field"
                                value={vehicleName}
                                onChange={(e) => setVehicleName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="vehiclenumber">Vehicle Number</label>
                            <input
                                type="text"
                                name="vehiclenumber"
                                id="vehiclenumber"
                                placeholder="Vehicle Number"
                                className="popup-input-field"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                                required
                                disabled
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="insurancedue">Insurance Due Date</label>
                            <input
                                type="date"
                                name="insurancedue"
                                id="insurancedue"
                                className="popup-input-field"
                                value={insuranceDueDate}
                                onChange={(e) => setInsuranceDueDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="isthimaradue">Isthimara Due Date</label>
                            <input
                                type="date"
                                name="isthimaradue"
                                id="isthimaradue"
                                className="popup-input-field"
                                value={istimaraDueDate}
                                onChange={(e) => setIstimaraDueDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="popup-form-field-row">
                        <div className="popup-form-field-column">
                            <label htmlFor="vehicletype">Vehicle Type</label>
                            <select
                                name="vehicletype"
                                id="vehicletype"
                                className="popup-input-field"
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                required
                            >
                                <option value="SUV">SUV</option>
                                <option value="MPV">MPV</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Limousine">Limousine</option>
                            </select>
                        </div>
                        <div className="popup-form-field-column">
                            <label htmlFor="vehiclestatus">Vehicle Status</label>
                            <select
                                name="vehiclestatus"
                                id="vehiclestatus"
                                className="popup-input-field"
                                value={vehicleStatus}
                                onChange={(e) => setVehicleStatus(e.target.value)}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="On Trip">On Trip</option>
                                <option value="In Workshop">In Workshop</option>
                                <option value="In Garage">In Garage</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="popup-submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default PopupForm;
