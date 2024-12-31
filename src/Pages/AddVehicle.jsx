import React from 'react'
import './AddVehicle.css'
import { ReactComponent as Edited } from '../assets/images/edit-3-svgrepo-com.svg';
import { ReactComponent as ScratchIcon } from '../assets/images/car-repair-svgrepo-com (1).svg'
import { ReactComponent as CarLocation } from '../assets/images/car-location-svgrepo-com.svg';

function AddVehicle() {
    return (
        <div className="vehicle">
            <div className="contents">
                <div className="left">
                    <div className="add-car">
                        <div className="form-container">
                            <form className="c-form-car" >
                                <h2 className="c-form-car-header" style={{color:'#2C2D2D'}}>ADD A CAR</h2>
                                <div className="c-form-field-row-car">
                                    <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                        <label htmlFor="vehiclename" className="c-form-field-label-car">Vehicle Name</label>
                                        <input
                                            type="text"
                                            name="vehiclename"
                                            id="vehiclename"
                                            placeholder="Vehicle Name"
                                            className="c-input-field-car"
                                            // value={vehicleData.vehiclename}
                                            // onChange={handleVehicleChange}
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
                                            // value={vehicleData.vehicleNumber}
                                            // onChange={handleVehicleChange}
                                        />
                                    </div>
                                    <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                        <label htmlFor="vehicletype" className="c-form-field-label-car">Vehicle Type</label>
                                        <select
                                            name="vehicletype"
                                            id="vehicletype"
                                            className="c-input-field-car"
                                            // value={vehicleData.vehicletype}
                                            // onChange={handleVehicleChange}
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
                                            // value={vehicleData.insurancedue}
                                            // onChange={handleVehicleChange}
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
                                            // value={vehicleData.isthimaradue}
                                            // onChange={handleVehicleChange}
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
                                            // value={vehicleData.odometerreading}
                                            // onChange={handleVehicleChange}
                                        />

                                    </div>
                                    <div className="c-form-field-column-car" style={{ width: '50%' }}>
                                        <label htmlFor="vehiclephoto" className="c-form-field-label-car">Upload Photo</label>
                                        <input
                                            type="file"
                                            name="vehiclephoto"
                                            id="vehiclephoto"
                                            className="c-input-field-car"
                                            // onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                        <input
                                            type="text"
                                            className="c-input-field-car"
                                            // value={fileName}
                                            readOnly
                                            placeholder="Choose a file"
                                            // onClick={() => document.getElementById('vehiclephoto').click()}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="c-submit-button-car">Submit</button>
                            </form>
                            {/* {showSucessPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSucessPopup(false)} />} */}
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

                    <button className="edit-cardd" >
                       <div style={{margin:'auto',display:'flex'}}>
                       <div className="iicon-container">
                            <Edited className='iicon' />
                        </div>
                        <div className="text-container">
                            <span className="count">EDIT   </span>
                            <span className="label">Vehicle Details</span>
                        </div>
                       </div>
                    </button>


                    <button className="edit-cardd" >
                        <div  style={{margin:'50px',display:'flex'}}>
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
                        <button id='scratch' className="edit-cardd" >
                            <div style={{margin:'auto',display:'flex'}}>
                            <div className="iicon-container">
                                <CarLocation />
                            </div>
                            <div className="text-container">
                                <span className="count">CHECK</span>
                                <span className="label">Vehicle Status</span>
                            </div>
                            </div>
                        </button>
                        {/* {showPopup && <StatusPopup onClose={() => setShowPopup(false)} />} */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddVehicle