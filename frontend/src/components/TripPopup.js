import React, { useState, useEffect } from "react";
import "./StatusPopup.css";

const TripPopup = ({ onClose }) => {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [extendDate, setExtendDate] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const tripsPerPage = 4;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://13.50.175.179:5000/api/trips");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        console.log("Fetched trips:", data);
        const filteredTrips = data.filter(
          (trip) => new Date(trip.tripDate) < new Date() && !trip.tripEndTime
        );
        setTrips(filteredTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
        // Handle error state or display a message to the user
      }
    };

    fetchTrips();
  }, []);

  const handleExtendClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://13.50.175.179:5000/api/trips/${selectedTrip._id}/extend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tripEndDate: extendDate }),
        }
      );
      if (response.ok) {
        alert("Trip extended successfully");
        onClose();
      } else {
        console.error("Error extending trip", response.statusText);
      }
    } catch (error) {
      console.error("Error extending trip", error);
    }
  };

  const handleMoreClick = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const startIndex = currentPage * tripsPerPage;
  const displayedTrips = trips.slice(startIndex, startIndex + tripsPerPage);

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>EXTEND TRIPS</h2>
        <table className="table-s">
          <thead>
            <tr>
              <th>Trip Number</th>
              <th>Vehicle Number</th>
              <th>Driver ID</th>
              <th></th> {/* Empty header for the button column */}
            </tr>
          </thead>
          <tbody>
            {displayedTrips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.tripNumber}</td>
                <td>{trip.vehicleNumber}</td>
                <td>{trip.driverId}</td>
                <td>
                  <button
                    className="extend-button"
                    onClick={() => handleExtendClick(trip)}
                  >
                    Extend Trip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {startIndex + tripsPerPage < trips.length && (
          <button className="more-button" onClick={handleMoreClick}>
            More
          </button>
        )}
        {selectedTrip && (
          <div>
            <label>Extend Trip Upto: </label>
            <input
              type="date"
              required
              className="c-input-field-s"
              value={extendDate}
              onChange={(e) => setExtendDate(e.target.value)}
            />
            <button className="extend-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPopup;
