import React, { useEffect, useState } from "react";
import { ReactComponent as CarSideIcon } from "../assets/images/car-side-svgrepo-com.svg";
import "./dash-overview.css";
import axios from "axios";
import { formatDate } from "../utils/dateFormater";
import Map from "../components/Map";

const DashboardPage = () => {
  const [allTrips, setAllTrips] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [tripDetailData, setTripDetailData] = useState(null);
  const [inGarageVehicles, setInGarageVehicles] = useState([]);
  const [statisticData, setStatisticData] = useState({
    numberOfTrips: null,
    monthlyTrips: null,
    weeklyTrips: null,
    dailyTrips: null,
  });
  const [searchLiveTripsValue, setSearchLiveTripValue] = useState("");

  // getAllTrips Api handler
  const getAllTripsApiHandler = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/allTrips`);
      if (response.status === 200) {
        activeTripsSortHandler(response.data);
        setAllTrips(response.data);
      }
    } catch (error) {
      console.log(`Error in fetching allTrips error: ${error}`);
    }
  };

  // active trips sort handler
  const activeTripsSortHandler = async (allTripsData) => {
    if (!allTripsData) return;

    const todaysDate = new Date();
    const isoDateString = todaysDate.toISOString();
    const activeTrips = allTripsData.filter(
      (val) => isoDateString >= val.tripDate && isoDateString <= val.tripEndDate
    );
    setActiveTrips(activeTrips);
  };

  // get all vehicles data api
  const getAllVehiclesDataApiHandler = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/vehicles");
      if (response.status === 200) {
        filterGarageVehiclesData(response.data);
      }
    } catch (error) {
      console.log(`Error in fetching vehicles Data error: ${error}`);
    }
  };

  // filter garage status vehicle from all vehicles data
  const filterGarageVehiclesData = (allVehiclesData) => {
    const garageVehicles = allVehiclesData.filter(
      (val) => val.vehicleStatus === "In Garage"
    );
    setInGarageVehicles(garageVehicles);
  };

  // statistic data api
  const statisticDataApiHandler = async () => {
    try {
      const [numberOfTripsRes, weeklyTripsRes, monthlyTripsRes, dailyTripsRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/tripCount"),
          axios.get("http://localhost:5000/api/weeklyTrips"),
          axios.get("http://localhost:5000/api/monthlyTrips"),
          axios.get("http://localhost:5000/api/dailyTrips"),
        ]);

      setStatisticData((prevValue) => {
        return {
          ...prevValue,
          numberOfTrips:
            numberOfTripsRes.status === 200
              ? numberOfTripsRes.data.count
              : prevValue.numberOfTrips,
          weeklyTrips:
            weeklyTripsRes.status === 200
              ? weeklyTripsRes.data.count
              : prevValue.weeklyTrips,
          monthlyTrips:
            monthlyTripsRes.status === 200
              ? monthlyTripsRes.data.count
              : prevValue.monthlyTrips,
          dailyTrips:
            dailyTripsRes.status === 200
              ? dailyTripsRes.data.count
              : prevValue.dailyTrips,
        };
      });
    } catch (error) {
      console.log(`Error in fetching statistic Data error: ${error}`);
    }
  };

  // search handler
  const handleSearch = () => {
    const searchTrips = allTrips.filter((val) =>
      val.vehicleNumber.includes(searchLiveTripsValue)
    );
    activeTripsSortHandler(searchTrips);
  };

  // search useEffect
  useEffect(() => {
    if (searchLiveTripsValue) {
      handleSearch();
    } else {
      activeTripsSortHandler(allTrips);
    }
  }, [searchLiveTripsValue]);

  useEffect(() => {
    getAllTripsApiHandler();
    getAllVehiclesDataApiHandler();
    statisticDataApiHandler();
  }, []);

  return (
    <div className="dash-container">
      <div className="dash-grid-row">
        <div className="dash-col-1">
          <div className="dash-search-container">
            <h3>Active Trips</h3>
            <input
              type="text"
              placeholder="search with vehicle no or name"
              onChange={(e) => setSearchLiveTripValue(e.target.value)}
            />
          </div>
          {/* list mapping */}
          <div className="dash-activetrips-container">
            {activeTrips.length <= 0 ? (
              <p>No Active Trips</p>
            ) : (
              activeTrips.map((trip) => (
                <div
                  className="dash-activetrip-tile"
                  key={trip._id}
                  onClick={() => setTripDetailData(trip)}
                >
                  <div className="dash-activetrip-list-firstrow">
                    <h6>{`${trip.tripStartLocation} ${trip.vehicleNumber}`}</h6>
                    <h6 className="dash-activetrip-tile-status">Active</h6>
                  </div>
                  <div className="dash-activetrip-list-secondrow">
                    <div className="dash-activetrips-tile-imagecontainer">
                      <img
                        src={`data:image/png;base64,${trip.vehicleDetails.vehiclePhoto}`}
                        alt="car"
                      />
                    </div>
                    <div className="dash-activetrips-tile-vehicledetails">
                      <h6>{trip.vehicleDetails.vehicleName}</h6>
                      <h4>{trip.vehicleDetails.vehicleName}</h4>
                      <div className="dash-activetrips-tile-dashed-border"></div>
                    </div>
                  </div>
                  <div className="dash-activetrip-list-thirdrow">
                    <div className="dash-activetrip-tile-startdate-container">
                      <h6>START</h6>
                      <h5>{formatDate(trip.tripDate)}</h5>
                    </div>
                    <div className="dash-activetrip-tile-enddate-container">
                      <h6>END</h6>
                      <h5>{formatDate(trip.tripEndDate)}</h5>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="dash-col-2">
          <div className="dash-map-container">
            <h6>Trips Details</h6>
            <div className="dash-map">
              <Map
                pos1={tripDetailData ? tripDetailData.tripStartLatLng : null}
                pos2={
                  tripDetailData ? tripDetailData.tripDestinationLatLng : null
                }
                currentLoc={
                  tripDetailData
                    ? tripDetailData.vehicleDetails.vehicleLocation
                    : null
                }
              />
            </div>
          </div>
          {tripDetailData === null ? (
            <p>Select any active trips</p>
          ) : (
            <div className="dash-activetrips-details-container">
              <div className="dash-activetrips-detail-tile-firstrow">
                <h6 className="dash-activetrip-tile-status">Active</h6>
                <h6>{`${tripDetailData.tripStartLocation} ${tripDetailData.vehicleNumber}`}</h6>
              </div>
              <div className="dash-activetrip-list-secondrow">
                <div className="dash-activetrips-tile-imagecontainer">
                  <img
                    src={`data:image/png;base64,${tripDetailData.vehicleDetails.vehiclePhoto}`}
                    alt="car"
                  />
                </div>
                <div className="dash-activetrips-tile-vehicledetails">
                  <h6>{tripDetailData.vehicleDetails.vehicleName}</h6>
                  <h4>{tripDetailData.vehicleDetails.vehicleName}</h4>
                  <div className="dash-activetrips-tile-dashed-border"></div>
                </div>
              </div>
              <div className="dash-activetrip-list-thirdrow">
                <div className="dash-activetrip-tile-startdate-container">
                  <h6>45 KM</h6>
                  <h5>Distance</h5>
                </div>
                <div className="dash-activetrip-tile-enddate-container">
                  <h6>4 PERSON</h6>
                  <h5>Passengers</h5>
                </div>
              </div>
              <div className="dash-activetrip-list-forthrow">
                <div className="dash-activetrip-tile-startdate-container">
                  <h6>START</h6>
                  <h5>{formatDate(tripDetailData.tripDate)}</h5>
                </div>
                <div className="dash-activetrip-tile-enddate-container">
                  <h6>END</h6>
                  <h5>{formatDate(tripDetailData.tripEndDate)}</h5>
                </div>
              </div>
              <div className="dash-activetrip-list-fifthrow">
                <h6>Revenue</h6>
                <h6>{`QAR ${tripDetailData.tripRemunaration}`}</h6>
              </div>
              {/* <button>Start A Chat</button> */}
            </div>
          )}
        </div>
        <div className="dash-col-3">
          {/* <div className="dash-recentactivity">
            <h6>Recent Activity</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero,
              eveniet soluta deleniti illo debitis dolorum recusandae
              voluptatibus unde, doloribus nam nulla repudiandae. Ipsum illum
              earum nam, mollitia deleniti voluptas dolor.
            </p>
          </div>
          <div className="fleet-statistics"></div>
          <button className="dash-newTrip-btn">
            <div>
              <p>New Trip</p>
              <h6>TOYOTA TS 2015</h6>
              <p>2 min Ago</p>
            </div>
            <div>Arrow</div>
          </button> */}
          <div className="dash-upcomingtrips-container">
            <h6>Available Vehicles</h6>
            <div className="upcomingTripsList">
              {inGarageVehicles.length <= 0 ? (
                <p>No Garage Vehicles</p>
              ) : (
                inGarageVehicles.map((vehicle) => (
                  <div className="dash-activetrip-tile" key={vehicle._id}>
                    <div
                      className="dash-activetrip-list-firstrow"
                      style={{ justifyContent: "end" }}
                    >
                      <h6 className="dash-activetrip-tile-status">
                        Assign Trip
                      </h6>
                    </div>
                    <div className="dash-activetrip-list-secondrow">
                      <div className="dash-activetrips-tile-imagecontainer">
                        <img
                          src={`data:image/png;base64,${vehicle.vehiclePhoto}`}
                          alt="car"
                        />
                      </div>
                      <div className="dash-activetrips-tile-vehicledetails">
                        <h6>{vehicle.vehicleNumber}</h6>
                        <h4>{vehicle.vehicleName}</h4>
                        <div className="dash-activetrips-tile-dashed-border"></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="dash-fleetstatistic">
            <h6>Fleet statistic</h6>
            <div className="statistic-card-container">
              <div className="fleet-statistic-card">
                <div className="fleet-statistic-card-icon-container">
                  <CarSideIcon />
                </div>
                <div className="fleet-statistic-card-veerticaldivider"></div>
                <div>
                  <div className="statistic-card-lablel">Number of Trips</div>
                  <div className="statistic-card-value">
                    {statisticData.numberOfTrips}
                  </div>
                </div>
              </div>
              <div className="fleet-statistic-card">
                <div className="fleet-statistic-card-icon-container">
                  <CarSideIcon />
                </div>
                <div className="fleet-statistic-card-veerticaldivider"></div>
                <div>
                  <div className="statistic-card-lablel">Weekly Trips</div>
                  <div className="statistic-card-value">
                    {statisticData.weeklyTrips}
                  </div>
                </div>
              </div>
              <div className="fleet-statistic-card">
                <div className="fleet-statistic-card-icon-container">
                  <CarSideIcon />
                </div>
                <div className="fleet-statistic-card-veerticaldivider"></div>
                <div>
                  <div className="statistic-card-lablel">Monthly Trips</div>
                  <div className="statistic-card-value">
                    {statisticData.monthlyTrips}
                  </div>
                </div>
              </div>
              <div className="fleet-statistic-card">
                <div className="fleet-statistic-card-icon-container">
                  <CarSideIcon />
                </div>
                <div className="fleet-statistic-card-veerticaldivider"></div>
                <div>
                  <div className="statistic-card-lablel">Daily Trips</div>
                  <div className="statistic-card-value">
                    {statisticData.dailyTrips}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
