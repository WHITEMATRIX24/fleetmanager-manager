import React, { useState } from "react";
import Table from "../components/table";
import TablePopup from "../components/tablepopup";
import WorkshopDetailsPopup1 from "./WorkshopDetailsPopup1";

function WorkshopMovement() {
  const [showPopup, setShowPopup] = useState(false);
  const [workshopDetailsPopup, setWorkshopDetailsPopup] = useState(false);
  const [workshopDetails, setWorkshopDetails] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [data, setData] = useState([]);
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

  const handleAddWorkshopVisit = async (formData) => {
    try {
      console.log("Submitting form data:", formData); // Log form data
      const response = await fetch(
        "http://13.50.175.179:5000/api/workshop-movements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const newVisit = await response.json();
        setData((prevData) => [...prevData, newVisit]);
        setShowPopup(false);
        window.location.reload();
      } else {
        throw new Error("Failed to add workshop visit");
      }
    } catch (error) {
      console.error("Error adding workshop visit:", error);
    }
  };
  return (
    <>
      <section id="worksho">
        <div classname="contents">
          <div class="tables">
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
              onSubmit={handleAddWorkshopVisit}
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
  );
}

export default WorkshopMovement;
