import React, { useState, useEffect } from 'react';
import './editdriver.css';
import DriverPopupForm from './driverpopup'; // Ensure this path is correct
import PHeader from './pageheader'; // Ensure this path is correct
import PageSidebar from './Pagesidebar'; // Ensure this path is correct

function EditDriver() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const driversPerPage = 6;

    // Fetch drivers from the backend
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/drivers');
                const data = await response.json();
                setDrivers(data);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };
        fetchDrivers();
    }, []);

    const handleEditClick = (driver) => {
        setSelectedDriver(driver);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setSelectedDriver(null);
        setShowPopup(false);
        setShowDeletePopup(false);
    };

    const handleSubmitForm = (formData) => {
        console.log(formData);
        handleClosePopup();
    };

    const handleMoreClick = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedDriver) return;
        console.log(`Deleting driver with ID: ${selectedDriver._id}`); // Debugging line
        try {
            const response = await fetch(`http://localhost:5000/api/drivers/${selectedDriver._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setDrivers(drivers.filter(driver => driver._id !== selectedDriver._id));
                alert('Driver deleted successfully!');
            } else {
                const errorText = await response.text();
                alert(`Error deleting driver: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        handleClosePopup();
    };

    const handleDeleteClick = (driver) => {
        setSelectedDriver(driver);
        setShowDeletePopup(true);
    };

    const displayedDrivers = drivers.slice(0, currentPage * driversPerPage);

    return (
        <div className='edit-driver-main'>
            <PageSidebar />
            <PHeader />
            <div className="edit-driver-content">
                <h2>DRIVERS ON BOARD</h2>
                <div className="driver-grid">
                    {displayedDrivers.map((driver) => (
                        <div key={driver._id} className='driver-tile'>
                            <div className="driver-detail">
                                <h2>Driver Name:</h2>
                                <span>{driver.driverName}</span>
                            </div>
                            <div className="driver-detail">
                                <h2>Driver ID:</h2>
                                <span>{driver.driverId}</span>
                            </div>
                            <div className="driver-actions">
                                <button className="edit-button" onClick={() => handleEditClick(driver)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteClick(driver)}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {displayedDrivers.length < drivers.length && (
                    <button className="more-button" onClick={handleMoreClick}>More</button>
                )}

                {showPopup && (
                    <DriverPopupForm
                        driver={selectedDriver}
                        onSubmit={handleSubmitForm}
                        onClose={handleClosePopup}
                    />
                )}
                {showDeletePopup && selectedDriver && (
                    <div className="popup-form-overlay">
                        <div className="popup-form-container">
                            <span className="close-popup" onClick={handleClosePopup}>&times;</span>
                            <h2>Confirm Delete</h2>
                            <p>Do you want to delete driver with ID {selectedDriver.driverId}?</p>
                            <button className="confirm-button" onClick={handleDeleteConfirm}>Confirm</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditDriver;
