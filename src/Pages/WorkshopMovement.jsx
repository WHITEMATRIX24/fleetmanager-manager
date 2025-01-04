import React, { useState } from 'react'
import Table from '../components/table'
import TablePopup from '../components/tablepopup';
import WorkshopDetailsPopup1 from './WorkshopDetailsPopup1';

function WorkshopMovement() {
    const [showPopup, setShowPopup] = useState(false);
    const [workshopDetailsPopup, setWorkshopDetailsPopup] = useState(false);
    const [workshopDetails, setWorkshopDetails] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    // Function to open the "Add Workshop Visit" popup
    const showAddWorkshopVisitPopup = () => setShowPopup(true);

    // Function to close the "Add Workshop Visit" popup
    const closeAddWorkshopVisitPopup = () => setShowPopup(false);

    // Function to show the "Workshop Details" popup
    const showWorkshopDetailsPopup = (details, vehicleNumber) => {
        setWorkshopDetails(details);
        setSelectedVehicle(vehicleNumber);
        setWorkshopDetailsPopup(true);
    };

    // Function to close the "Workshop Details" popup
    const closeWorkshopDetailsPopup = () => setWorkshopDetailsPopup(false);



    return (
        <>
            <section id="worksho">

                <div classname="contents">
                    <div class='tables'>
                        <Table 
                        showAddWorkshopVisitPopup={showAddWorkshopVisitPopup}
                        showWorkshopDetailsPopup={showWorkshopDetailsPopup}
                        />
                    </div>



                    {/* Conditionally render the popups */}
                    {showPopup && (
                        <TablePopup
                            onClose={closeAddWorkshopVisitPopup}
                            isShow={showPopup}
                        />
                    )}
                    {workshopDetailsPopup && (
                        <WorkshopDetailsPopup1
                            onClose={closeWorkshopDetailsPopup}
                            details={workshopDetails}
                            vehicleNumber={selectedVehicle}
                        />
                    )}


                </div>
            </section>
        </>
    )
}

export default WorkshopMovement