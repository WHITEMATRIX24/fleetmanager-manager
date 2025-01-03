import React, { useState } from 'react'
import './AddVehicle.css'
import { ReactComponent as Edited } from '../assets/images/edit-3-svgrepo-com.svg';
import { ReactComponent as ScratchIcon } from '../assets/images/car-repair-svgrepo-com (1).svg'
import { ReactComponent as CarLocation } from '../assets/images/car-location-svgrepo-com.svg';
import imageCompression from 'browser-image-compression';
import SuccessPopup from '../components/SuccessPopup';
import StatusPopup from '../components/StatusPopup';
import { useNavigate } from 'react-router-dom';
function AddVehicle() {
    const [fileName, setFileName] = useState('');
    const [showSucessPopup, setShowSucessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [vehicleData, setVehicleData] = useState({
        vehiclename: '',
        vehiclenumber: '',
        insurancedue: '',
        isthimaradue: '',
        vehicletype: '',
        odometerreading: '',
        vehiclephoto: null,
    });
    const carImages = {

        sedan: [
            'assets/SEDAN/LSV.png',
            'assets/SEDAN/RSV.png',
            'assets/SEDAN/FV.png',
            'assets/SEDAN/BV.png',
            'assets/SEDAN/TV.png',
        ],
        suv: [
            'assets/SUV/LSV.png',
            'assets/SUV/RSV.png',
            'assets/SUV/FV.png',
            'assets/SUV/BV.png',
            'assets/SUV/TV.png',
        ],
        mpv: [
            'assets/MPV/LSV.png',
            'assets/MPV/RSV.png',
            'assets/MPV/FV.png',
            'assets/MPV/BV.png',
            'assets/MPV/TV.png',
        ],
        limousine: [
            'assets/LIMO/LSV.png',
            'assets/LIMO/RSV.png',
            'assets/LIMO/FV.png',
            'assets/LIMO/BV.png',
            'assets/LIMO/TV.png',
        ],
        bus: [
            'assets/BUS/LSV.png',
            'assets/BUS/RSV.png',
            'assets/BUS/FV.png',
            'assets/BUS/BV.png',
            'assets/BUS/TV.png',

        ]
    };

    const handleChange = (event) => {
        handleVehicleChange(event);
        handleFileNameChange(event);
    };
    const handleVehicleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'vehiclephoto' && files?.[0]) {
            const file = files[0];
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (validImageTypes.includes(file.type)) {
                setVehicleData((prevState) => ({ ...prevState, vehiclephoto: file }));
                setFileName(file.name);
            } else {
                setPopupMessage("Invalid file type. Please upload a JPG or PNG image.");
                setShowPopup(true);
            }
        } else {
            setVehicleData((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const handleFileNameChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('');
        }
    };
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
    const handleVehicleSubmit = async (e) => {
        e.preventDefault();

        if (!vehicleData.vehiclephoto) {
            setPopupMessage("Please upload an image.");
            setShowPopup(true);
            return;
        }

        try {
            const options = { maxSizeMB: 0.1, maxWidthOrHeight: 300, useWebWorker: true };
            let compressedFile = await imageCompression(vehicleData.vehiclephoto, options);

            while (compressedFile.size > 70 * 1024) {
                options.maxSizeMB /= 2;
                compressedFile = await imageCompression(compressedFile, options);
            }

            const base64Image = (await toBase64(compressedFile)).replace(/^data:image\/[a-zA-Z]+;base64,/, '');
            const formData = { ...vehicleData, vehiclephoto: base64Image, ...carImages[vehicleData.vehicletype.toLowerCase()] };

            const response = await fetch('http://localhost:5000/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setPopupMessage('Vehicle added successfully!');
                setShowSucessPopup(true);
                setVehicleData({
                    vehiclename: '', vehiclenumber: '', insurancedue: '', isthimaradue: '',
                    vehicletype: '', odometerreading: '', vehiclephoto: null,
                });
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (error) {
            setPopupMessage(`Error: ${error.message}`);
            setShowPopup(true);
        }
    };
    const handleEditCarDetailsClick = () => {
        navigate('/editcar');
    };
    const handleClick = () => {
        const scratchesSection = document.getElementById('scratches');
        if (scratchesSection) {
            scratchesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="vehicle">
            <div className="contents">
                <div className="left">
                    <div className="add-car">
                        <div className="form-container">
                            <form className="c-form-car" onSubmit={handleVehicleSubmit}>
                                <h2 className="c-form-car-header">ADD A CAR</h2>
                                <div className="c-form-field-row-car">
                                    <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                        <label htmlFor="vehiclename" className="c-form-field-label-car">Vehicle Name</label>
                                        <input
                                            type="text"
                                            name="vehiclename"
                                            id="vehiclename"
                                            placeholder="Vehicle Name"
                                            className="c-input-field-car"
                                            value={vehicleData.vehiclename}
                                            onChange={handleVehicleChange}
                                        />
                                    </div>
                                    <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                        <label htmlFor="vehiclenumber" className="c-form-field-label-car">Vehicle Number</label>
                                        <input
                                            type="text"
                                            name="vehiclenumber"
                                            id="vehiclenumber"
                                            placeholder="Vehicle Number"
                                            className="c-input-field-car"
                                            value={vehicleData.vehicleNumber}
                                            onChange={handleVehicleChange}
                                        />
                                    </div>
                                    <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                        <label htmlFor="vehicletype" className="c-form-field-label-car">Vehicle Type</label>
                                        <select
                                            name="vehicletype"
                                            id="vehicletype"
                                            className="c-input-field-car"
                                            value={vehicleData.vehicletype}
                                            onChange={handleVehicleChange}
                                        >
                                            <option value="">Select Vehicle Type</option>
                                            <option value="SUV">SUV</option>
                                            <option value="MPV">MPV</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="Limousine">Limousine</option>
                                            <option value="Bus">Bus</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="c-form-field-row-car">
                                    <div className="c-form-field-column-car" style={{ width: '50%' }}>
                                        <label htmlFor="insurancedue" className="c-form-field-label-car">Insurance Due Date</label>
                                        <input
                                            type="date"
                                            name="insurancedue"
                                            id="insurancedue"
                                            placeholder="dd-mm-yyyy"
                                            className="c-input-field-car"
                                            value={vehicleData.insurancedue}
                                            onChange={handleVehicleChange}
                                        />
                                    </div>
                                    <div className="c-form-field-column-car" style={{ width: '50%' }}>
                                        <label htmlFor="isthimaradue" className="c-form-field-label-car">Isthimara Due Date</label>
                                        <input
                                            type="date"
                                            name="isthimaradue"
                                            id="isthimaradue"
                                            placeholder="dd-mm-yyyy"
                                            className="c-input-field-car"
                                            value={vehicleData.isthimaradue}
                                            onChange={handleVehicleChange}
                                        />
                                    </div>
                                </div>
                                <div className="c-form-field-row-car">
                                    <div className="c-form-field-column-car" style={{ width: '50%' }}>
                                        <label htmlFor="vehicletype" className="c-form-field-label-car">Odometer Reading</label>
                                        <input
                                            type='text'
                                            name="odometerreading"
                                            id="odometerreading"
                                            placeholder='Odometer Reading'
                                            className="c-input-field-car"
                                            value={vehicleData.odometerreading}
                                            onChange={handleVehicleChange}
                                        />

                                    </div>
                                    <div className="c-form-field-column-car" style={{ width: '50%' }}>
                                        <label htmlFor="vehiclephoto" className="c-form-field-label-car">Upload Photo</label>
                                        <input
                                            type="file"
                                            name="vehiclephoto"
                                            id="vehiclephoto"
                                            className="c-input-field-car"
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                        <input
                                            type="text"
                                            className="c-input-field-car"
                                            value={fileName}
                                            readOnly
                                            pointer="cursor"
                                            placeholder="Choose a file"
                                            onClick={() => document.getElementById('vehiclephoto').click()}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="c-submit-button-car">Submit</button>
                            </form>
                            {showSucessPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSucessPopup(false)} />}
                        </div>
                    </div>
                </div>
                <div className="right">
                    {/* <div className="image-section">
                                    <div className="cardss">
                                        <div className="trip-images" style={{ backgroundImage: `url(${carImage})` }}><div className='oveerlay'></div>
                                            <div className='button-container'>
                                                <button className="image-button" onClick={handleEditCarDetailsClick}>Edit Car Details</button>
                                                <button className="image-button">Add Scratches</button>
                                            </div>
                                        </div>
                                    </div>

                                </div> */}

                    <button className="edit-cardd-vehicle" onClick={handleEditCarDetailsClick}>
                        <div style={{ margin: 'auto', display: 'flex' }}>
                            <div className="iicon-container">
                                <Edited className='iicon' />
                            </div>
                            <div className="text-container">
                                <span className="count">EDIT   </span>
                                <span className="label">Vehicle Details</span>
                            </div>
                        </div>
                    </button>


                    <button className="edit-cardd-vehicle" onClick={handleClick}>
                        <div style={{ margin: '50px', display: 'flex' }}>
                            <div className="iicon-container">
                                < ScratchIcon className="iicon" />
                            </div>
                            <div className="text-container">
                                <span className="count">ADD</span>
                                <span className="label">Scratches</span>
                            </div>
                        </div>
                    </button>
                    <div>
                        <button id='scratch' className="edit-cardd-vehicle" onClick={() => setShowPopup(true)}>
                            <div style={{ margin: 'auto', display: 'flex' }}>
                                <div className="iicon-container">
                                    <CarLocation />
                                </div>
                                <div className="text-container">
                                    <span className="count">CHECK</span>
                                    <span className="label">Vehicle Status</span>
                                </div>
                            </div>
                        </button>
                        {showPopup && <StatusPopup onClose={() => setShowPopup(false)} />}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddVehicle