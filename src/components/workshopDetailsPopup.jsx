import React from 'react';
import './workshopDetailsPopup.css'

const WorkshopDetailsPopup = ({ onClose, details, vehicleNumber }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className='popup-form-overlay-work'>
            <div className="popup-form-container-work">
                <span className="close-popup-work" onClick={onClose}>&times;</span>
                <div className="popup-form-work">
                    <h2>WORKSHOP DETAILS FOR CAR: {vehicleNumber}</h2>
                    <table className="details-table-work">
                        <thead>
                            <tr>
                                <th>Workshop Visit Date</th>

                                <th>Complaint Detail</th>
                                <th>Amount Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail, index) => (
                                <tr key={index}>
                                    <td>{formatDate(detail.workshopVisitDate)}</td>
                                    <td>{detail.complaintDetail}</td>
                                    <td>{detail.amountSpent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetailsPopup;
