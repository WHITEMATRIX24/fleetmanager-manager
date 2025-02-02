const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  driverPassword: { type: String, required: true },
  driverName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  location: { type: String, default: null },
  driverPin: { type: Number, default: null },
  driverLicenceNumber: { type: String, required: true },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], // Assuming Trip is another model
  driverLicenceExpiryDate: { type: Date, required: true },
  notesAboutDriver: { type: String, default: null },
  driverPhoto: { type: String, default: null },
});

module.exports = mongoose.model("Driver", driverSchema);

// anulisba
// aCZHjI8NyQLOHV2d

// correct use effect
// useEffect(() => {
//   // Fetch attendance data from backend
//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://13.50.175.179:5000/api/attendance'); // Replace with your API endpoint
//       setAttendanceData(response.data);
//       setFilteredData(response.data); // Initialize filteredData with all data initially
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);
