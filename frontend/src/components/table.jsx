import React, { useState, useEffect } from "react";
import "./table.css";

const Table = ({ showWorkshopDetailsPopup, showAddWorkshopVisitPopup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the data (same logic as before)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      try {
        const response = await fetch(
          "http://13.50.175.179:5000/api/workshop-movements"
        );
        const result = await response.json();

        // Aggregate data by vehicle number and find the latest tyre change date
        const aggregatedData = result.reduce((acc, item) => {
          const vehicle = acc.find(
            (v) => v.vehicleNumber === item.vehicleNumber
          );
          if (vehicle) {
            vehicle.workshopVisits += 1;
            vehicle.LastService =
              new Date(vehicle.LastService) > new Date(item.workshopVisitDate)
                ? vehicle.LastService
                : item.workshopVisitDate;
            if (item.complaintDetail === "Tyre Change") {
              vehicle.TyreChange =
                new Date(vehicle.TyreChange) > new Date(item.workshopVisitDate)
                  ? vehicle.TyreChange
                  : item.workshopVisitDate;
            }
          } else {
            acc.push({
              vehicleNumber: item.vehicleNumber,
              LastService: item.workshopVisitDate,
              TyreChange:
                item.complaintDetail === "Tyre Change"
                  ? item.workshopVisitDate
                  : null,
              workshopVisits: 1,
            });
          }
          return acc;
        }, []);
        setData(aggregatedData);
      } catch (error) {
        console.error("Error fetching workshop movements:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.vehicleNumber.includes(searchTerm)
  );

  const handleShowDetails = async (vehicleNumber) => {
    console.log(`Fetching details for vehicle: ${vehicleNumber}`);
    try {
      const response = await fetch(
        `http://13.50.175.179:5000/api/workshop-movements/${vehicleNumber}`
      );
      const result = await response.json();
      console.log("Workshop details fetched:", result);

      if (Array.isArray(result.movements)) {
        showWorkshopDetailsPopup(
          result.movements.sort(
            (a, b) =>
              new Date(b.workshopVisitDate) - new Date(a.workshopVisitDate)
          ),
          vehicleNumber
        );
      } else {
        console.error("API response does not contain an array of movements");
      }
    } catch (error) {
      console.error("Error fetching workshop details:", error);
    }
  };

  return (
    <div className="table-container">
      <div className="headinsearch">
        <h2 className="table-header-h2">WORKSHOP MOVEMENT DETAILS</h2>
        <input
          type="text"
          className="search-bar-vehicle"
          placeholder="Search by Vehicle Number"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p style={{ padding: "10px" }}>Loading...</p> // Display loading message
      ) : filteredData.length === 0 ? (
        <div>
          <p sytle={{ padding: "10px" }}>No workshop history found</p>
        </div>
      ) : (
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
                <td>{item.TyreChange ? formatDate(item.TyreChange) : "N/A"}</td>
                <td>{item.workshopVisits}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleShowDetails(item.vehicleNumber)}
                  >
                    Show Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="table-more-button">More</button>
      <button className="c-submit-button" onClick={showAddWorkshopVisitPopup}>
        Add Workshop Visit
      </button>
    </div>
  );
};

export default Table;
