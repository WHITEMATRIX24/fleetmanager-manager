import React, { useState, useEffect } from 'react';
import './editcar.css';
import PopupForm from './PopupForm';
import PHeader from './pageheader';
import PageSidebar from './Pagesidebar';

function EditCar() {
    const [showPopup, setShowPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 6;

    // Fetch vehicles from the backend
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('https://fleetmanager-manager.onrender.com/api/vehicles');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data); // Log fetched data
                setCars(data); // Update state with fetched data
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };
        fetchCars();
    }, []);

    const handleEditClick = (car) => {
        setSelectedCar(car);
        setShowPopup(true);
    };

    const handleDeleteClick = (car) => {
        setSelectedCar(car);
        setShowDeletePopup(true);
    };

    const handleClosePopup = () => {
        setSelectedCar(null);
        setShowPopup(false);
        setShowDeletePopup(false);
    };

    const handleSubmitForm = (formData) => {
        console.log(formData);
        handleClosePopup();
    };

    const handleDeleteConfirm = async () => {
        console.log(`Deleting vehicle with ID: ${selectedCar._id}`); // Debugging line
        try {
            const response = await fetch(`https://fleetmanager-manager.onrender.com/api/vehicles/${selectedCar._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCars(cars.filter(car => car._id !== selectedCar._id));
                alert('Vehicle deleted successfully!');
            } else {
                const errorText = await response.text();
                alert(`Error deleting vehicle: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        handleClosePopup();
    };

    const handleMoreClick = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const displayedCars = cars.slice(0, currentPage * carsPerPage);

    return (
        <div className='edit-car-main'>
            <PageSidebar />
            <PHeader />
            <div className="edit-car-content">
                <h2 className='editcarh2'>AVAILABLE CARS</h2>
                <div className="car-grid">
                    {displayedCars.map((car) => (
                        <div key={car._id} className="car-tile">
                            <img
                                src={car.vehiclePhoto.startsWith('uploads')
                                    ? `https://fleetmanager-manager.onrender.com/${car.vehiclePhoto.replace(/\\/g, '/')}`
                                    : `data:image/png;base64,${car.vehiclePhoto}`
                                }
                                alt={car.vehicleName}
                                className="edit-car-image"
                            />
                            <div className="car-details">
                                <span className="car-name">{car.vehicleName}</span>
                                <div className="car-actions">
                                    <button className="edit-button" onClick={() => handleEditClick(car)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteClick(car)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {displayedCars.length < cars.length && (
                    <button className="more-button" onClick={handleMoreClick}>More</button>
                )}

                {showPopup && (
                    <PopupForm
                        car={selectedCar}
                        onSubmit={handleSubmitForm}
                        onClose={handleClosePopup}
                    />
                )}

                {showDeletePopup && (
                    <div className="popup-form-overlay">
                        <div className="popup-form-container">
                            <span className="close-popup" onClick={handleClosePopup}>&times;</span>
                            <h2 className='h2cr'>Confirm Delete</h2>
                            <p>Do you want to delete car number {selectedCar.vehicleNumber}?</p>
                            <button className="confirm-button" onClick={handleDeleteConfirm}>Confirm</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditCar;
