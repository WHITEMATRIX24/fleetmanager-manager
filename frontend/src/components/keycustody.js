import React from 'react';
import './keycustody.css';

const KeyCustody = () => {
    const dummyData = [
        { vehicleNumber: '1234', vehicleName: 'Toyota', driverId: 'D001', driverName: 'John Doe' },
        { vehicleNumber: '5678', vehicleName: 'Honda', driverId: 'D002', driverName: 'Jane Smith' },
        { vehicleNumber: '9101', vehicleName: 'Ford', driverId: 'D003', driverName: 'Mike Johnson' },
        { vehicleNumber: '1121', vehicleName: 'BMW', driverId: 'D004', driverName: 'Emily Davis' },
        { vehicleNumber: '3141', vehicleName: 'Audi', driverId: 'D005', driverName: 'Chris Lee' },
        { vehicleNumber: '5161', vehicleName: 'Mercedes', driverId: 'D006', driverName: 'Pat Taylor' },
        { vehicleNumber: '7181', vehicleName: 'Nissan', driverId: 'D007', driverName: 'Sam Wilson' },
        { vehicleNumber: '9201', vehicleName: 'Mazda', driverId: 'D008', driverName: 'Alex Brown' },
    ];

    return (
        <div className="keycustody-table-container">
            <div className='headinsearch'>
                <h2>KEY CUSTODY DETAILS</h2>
                <input type="text" className="search-bar" placeholder="Search by Vehicle Number" />
            </div>
            <table className="keycustody-vehicle-table">

                <thead>
                    <tr>
                        <th>Vehicle Number</th>
                        <th>Vehicle Name</th>
                        <th>Key Custody </th>

                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.vehicleNumber}</td>
                            <td>{data.vehicleName}</td>

                            <td>{data.driverName}</td>
                            <td><button className="keycustody-action-button">Change</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="keycustody-more-button">More</button>
        </div>
    );
};

export default KeyCustody;
