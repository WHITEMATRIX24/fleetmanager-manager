// tablepopup.js
import React, { useState } from 'react';
import './tablepopup.css';

const TablePopup = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        workshopVisitDate: '',
        visitType: '',
        nextOilChange: '',
        nextTyreChange: '',
        noOfDays: '',
        odometerReading: '',
        complaintDetail: '',
        amountSpent: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let complaintDetail = '';
        switch (formData.visitType) {
            case 'tyreChange':
                complaintDetail = 'Tyre Change';
                break;
            case 'oilChange':
                complaintDetail = 'Oil Change';
                break;
            case 'other':
                complaintDetail = formData.complaintDetail;
                break;
            default:
                break;
        }

        onSubmit({ ...formData, complaintDetail });
    };

    return (
        <div className='popup-form-overlay-table'>
            <div className="popup-form-container-table">
                <div className="popup-form-table">
                    <span className="close-popup-table" onClick={onClose}>&times;</span>
                    <h2>ADD WORKSHOP VISITS</h2>
                    <form className="popup-form" onSubmit={handleSubmit}>
                        <div className="popup-form-field-row">
                            <div className="popup-form-field-column">
                                <label>Vehicle Number</label>
                                <input name="vehicleNumber" className='popup-input-field' value={formData.vehicleNumber} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-field-column">
                                <label>Workshop Visit Date</label>
                                <input type="date" name="workshopVisitDate" className='popup-input-field' value={formData.workshopVisitDate} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="popup-form-field-row">
                            <div className="popup-form-field-column">
                                <label>Type of Workshop Visit</label>
                                <select name="visitType" className='popup-input-field' value={formData.visitType} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="tyreChange">Tyre Change</option>
                                    <option value="oilChange">Oil Change</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        {formData.visitType === 'tyreChange' && (
                            <>
                                <div className="popup-form-field-row">
                                    <div className="popup-form-field-column">
                                        <label>Next Tyre Change (in km)</label>
                                        <input type="text" className='popup-input-field' name="nextTyreChange" value={formData.nextTyreChange} onChange={handleChange} required />
                                    </div>
                                    <div className="popup-form-field-column">
                                        <label>Current Ododmeter Reading</label>
                                        <input type="number" className='popup-input-field' name="odometerReading" value={formData.odometerReading} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="popup-form-field-row">
                                    <div className="popup-form-field-column">
                                        <label>No of Days in Workshop</label>
                                        <input type="number" className='popup-input-field' name="noOfDays" value={formData.noOfDays} onChange={handleChange} required />
                                    </div>
                                    <div className="popup-form-field-column">
                                        <label>Amount Spent</label>
                                        <input type="number" className='popup-input-field' name="amountSpent" value={formData.amountSpent} onChange={handleChange} required />
                                    </div>
                                </div>
                            </>
                        )}
                        {formData.visitType === 'oilChange' && (
                            <>
                                <div className="popup-form-field-row">
                                    <div className="popup-form-field-column">
                                        <label>Next Oil Change (in km)</label>
                                        <input type="text" className='popup-input-field' name="nextOilChange" value={formData.nextOilChange} onChange={handleChange} required />
                                    </div>
                                    <div className="popup-form-field-column">
                                        <label>Current Ododmeter Reading</label>
                                        <input type="number" className='popup-input-field' name="odometerReading" value={formData.odometerReading} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="popup-form-field-row">
                                    <div className="popup-form-field-column">
                                        <label>No of Days in Workshop</label>
                                        <input type="number" className='popup-input-field' name="noOfDays" value={formData.noOfDays} onChange={handleChange} required />
                                    </div>
                                    <div className="popup-form-field-column">
                                        <label>Amount Spent</label>
                                        <input type="number" className='popup-input-field' name="amountSpent" value={formData.amountSpent} onChange={handleChange} required />
                                    </div>
                                </div>
                            </>
                        )}
                        {formData.visitType === 'other' && (
                            <>
                                <div className="popup-form-field-row">
                                    <div className="popup-form-field-column">
                                        <label>Complaint Detail</label>
                                        <input name="complaintDetail" className='popup-input-field' value={formData.complaintDetail} onChange={handleChange} required />
                                    </div>
                                    <div className="popup-form-field-column">
                                        <label>Current Ododmeter Reading</label>
                                        <input type="number" className='popup-input-field' name="odometerReading" value={formData.odometerReading} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="popup-form-field-row">
                                    <div className="popup-form-field-column">
                                        <label>No of Days in Workshop</label>
                                        <input type="number" className='popup-input-field' name="noOfDays" value={formData.noOfDays} onChange={handleChange} required />
                                    </div>
                                    <div className="popup-form-field-column">
                                        <label>Amount Spent</label>
                                        <input type="number" className='popup-input-field' name="amountSpent" value={formData.amountSpent} onChange={handleChange} required />
                                    </div>
                                </div>

                            </>
                        )}
                        <button className='c-submit-button' type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TablePopup;
