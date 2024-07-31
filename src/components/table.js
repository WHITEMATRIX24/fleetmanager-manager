import React, { useState, useEffect } from 'react';
import './table.css';
import TablePopup from './tablepopup';
import WorkshopDetailsPopup from './workshopDetailsPopup';

const Table = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [workshopDetailsPopup, setWorkshopDetailsPopup] = useState(false);
    const [workshopDetails, setWorkshopDetails] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/workshop-movements');
                const result = await response.json();

                // Aggregate data by vehicle number and find the latest tyre change date
                const aggregatedData = result.reduce((acc, item) => {
                    const vehicle = acc.find(v => v.vehicleNumber === item.vehicleNumber);
                    if (vehicle) {
                        vehicle.workshopVisits += 1;
                        vehicle.LastService = new Date(vehicle.LastService) > new Date(item.workshopVisitDate) ? vehicle.LastService : item.workshopVisitDate;
                        if (item.complaintDetail === 'Tyre Change') {
                            vehicle.TyreChange = new Date(vehicle.TyreChange) > new Date(item.workshopVisitDate) ? vehicle.TyreChange : item.workshopVisitDate;
                        }
                    } else {
                        acc.push({
                            vehicleNumber: item.vehicleNumber,
                            LastService: item.workshopVisitDate,
                            TyreChange: item.complaintDetail === 'Tyre Change' ? item.workshopVisitDate : null,
                            workshopVisits: 1,
                        });
                    }
                    return acc;
                }, []);
                setData(aggregatedData);
            } catch (error) {
                console.error('Error fetching workshop movements:', error);
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = data.filter(item =>
        item.vehicleNumber.includes(searchTerm)
    );

    const handleShowDetails = async (vehicleNumber) => {
        console.log(`Fetching details for vehicle: ${vehicleNumber}`);
        try {
            const response = await fetch(`http://localhost:5000/api/workshop-movements/${vehicleNumber}`);
            const result = await response.json();
            console.log('Workshop details fetched:', result);

            // Check if result.movements is an array
            if (Array.isArray(result.movements)) {
                setWorkshopDetails(result.movements.sort((a, b) => new Date(b.workshopVisitDate) - new Date(a.workshopVisitDate)));
                setSelectedVehicle(vehicleNumber);
                setWorkshopDetailsPopup(true); // Set to true to display the popup
            } else {
                console.error('API response does not contain an array of movements');
            }
        } catch (error) {
            console.error('Error fetching workshop details:', error);
        }
    };

    const handleAddWorkshopVisit = async (formData) => {
        try {
            console.log('Submitting form data:', formData); // Log form data
            const response = await fetch('http://localhost:5000/api/workshop-movements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newVisit = await response.json();
                setData(prevData => [...prevData, newVisit]);
                setShowPopup(false);
                window.location.reload();
            } else {
                throw new Error('Failed to add workshop visit');
            }
        } catch (error) {
            console.error('Error adding workshop visit:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="table-container">
            <div className='headinsearch'>
                <h2>WORKSHOP MOVEMENT DETAILS</h2>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by Vehicle Number"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <table className="vehicle-table">
                <thead>
                    <tr>
                        <th>Vehicle Number</th>
                        <th>Last Service</th>
                        <th>Tyre Change</th>
                        <th>Workshop Visits</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.vehicleNumber}</td>
                            <td>{formatDate(item.LastService)}</td>
                            <td>{item.TyreChange ? formatDate(item.TyreChange) : 'N/A'}</td>
                            <td>{item.workshopVisits}</td>
                            <td>
                                <button className="action-button" onClick={() => handleShowDetails(item.vehicleNumber)}>
                                    Show Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="table-more-button">More</button>
            <button className="c-submit-button" onClick={() => setShowPopup(true)}>Add Workshop Visit</button>
            {showPopup && (
                <TablePopup
                    onClose={() => setShowPopup(false)}
                    onSubmit={handleAddWorkshopVisit}
                />
            )}
            {workshopDetailsPopup && (
                <WorkshopDetailsPopup
                    onClose={() => setWorkshopDetailsPopup(false)}
                    details={workshopDetails}
                    vehicleNumber={selectedVehicle}
                />
            )}
        </div>
    );
};

export default Table;
