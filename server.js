const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const {
  uploadTos3Bucket,
  deleteFromS3bucket,
} = require("./utils/s3functionProvider");

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve static files
app.use(bodyParser.json({ limit: '10mb' })); // Set a higher limit for JSON payloads
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Database connection
mongoose.connect("mongodb+srv://anulisba:aCZHjI8NyQLOHV2d@fleetmanager.mdvsoan.mongodb.net/?retryWrites=true&w=majority&appName=fleetmanager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
const vehicleRoutes = require('./routes/vehicles');
const driverRoutes = require('./routes/drivers');
const workshopMovementRoutes = require('./routes/workshopMovements');
const managerRoutes = require('./routes/managers');
const issueRoutes = require('./routes/issues');
const attendanceRoutes = require('./routes/attendenceRoutes');  // Corrected import
const tripRoutes = require("./routes/trips");

// Use routes
app.use('/api', vehicleRoutes);
app.use('/api', driverRoutes);
app.use('/api', workshopMovementRoutes);
app.use('/api', managerRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', issueRoutes);
app.use("/api", tripRoutes);



// Models
const Vehicle = require('./models/vehicle');
const Driver = require('./models/driver');
const Trip = require('./models/trip');
const WorkshopMovement = require('./models/workshopMovement')
const Scratch = require('./models/scratch');
const Manager = require('./models/manager');



// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append the current timestamp to the file name
//   },
// });
// const uploads = multer({ storage: storage });
app.post('/api/login', async (req, res) => {
  console.log('Login attempt:', req.body);
  const { username, password } = req.body;

  try {
    // Log the query being executed
    console.log('Query:', { managerUsername: username, managerPassword: password });

    const manager = await Manager.findOne({ managerUsername: username, managerPassword: password });

    if (manager) {
      console.log('Manager found:', manager);
      res.json({ success: true });
    } else {
      console.log('Manager not found');
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/getManagerUsername', async (req, res) => {
  try {
    const manager = await Manager.findOne({});
    if (manager) {
      res.json({ managerUsername: manager.managerUsername });
    } else {
      res.status(404).json({ message: 'Manager not found' });
    }
  } catch (error) {
    console.error('Error fetching manager username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/verify-vehicle', async (req, res) => {
  const { vehicleNumber } = req.body;
  try {
    const vehicle = await Scratch.findOne({ vehicleNumber });
    if (vehicle) {
      res.json({ found: true });
    } else {
      res.json({ found: false });
    }
  } catch (error) {
    console.error('Error verifying vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/upload-image', async (req, res) => {
  const { vehicleNumber, view, images } = req.body;

  console.log('Received upload request:', { vehicleNumber, view, images });

  try {
    const vehicle = await Scratch.findOne({ vehicleNumber });
    if (!vehicle) {
      console.error('Vehicle not found');
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    console.log('Vehicle found:', vehicle);

    if (view === 'LSV') {
      vehicle.scratchOrgLsv.push(...images);
    } else if (view === 'RSV') {
      vehicle.scratchOrgRsv.push(...images);
    } else if (view === 'FV') {
      vehicle.scratchFvOrg.push(...images);
    } else if (view === 'TV') {
      vehicle.scratchTvOrg.push(...images);
    } else if (view === 'BV') {
      vehicle.scratchBvOrg.push(...images);
    }

    console.log('Updated vehicle:', vehicle);

    const result = await vehicle.save();
    console.log('Vehicle saved successfully:', result);

    res.status(201).json(result);
  } catch (e) {
    console.error('Error saving vehicle:', e);
    res.status(500).json({ error: `Error: ${e.message}` });
  }
});


app.post('/api/fetch-scratch', async (req, res) => {
  const { vehicleNumber } = req.body;

  try {
    const vehicle = await Scratch.findOne({ vehicleNumber });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const parseData = (data) => {
      if (!data) return { base64: '' };
      return { base64: data };
    };

    const scratchLsvData = parseData(vehicle.scratchOrgLsv);
    const scratchRsvData = parseData(vehicle.scratchOrgRsv);
    const scratchFvData = parseData(vehicle.scratchFvOrg);
    const scratchTvData = parseData(vehicle.scratchTvOrg);
    const scratchBvData = parseData(vehicle.scratchBvOrg);

    console.log('Fetched Image Data:', {
      scratchLsvData,
      scratchRsvData,
      scratchFvData,
      scratchTvData,
      scratchBvData
    });

    res.status(200).json({
      scratchLsvData,
      scratchRsvData,
      scratchFvData,
      scratchTvData,
      scratchBvData,
      vehicleName: vehicle.vehicleName,
    });
  } catch (e) {
    console.error('Fetch Scratch Images Error:', e);
    res.status(500).send(`Error: ${e.message}`);
  }
});
app.post('/api/delete-scratch', async (req, res) => {
  const { vehicleNumber, image } = req.body;

  try {
    const vehicle = await Scratch.findOne({ vehicleNumber });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Function to remove the image from the appropriate array
    const removeImage = (array) => {
      const index = array.indexOf(image.base64);
      if (index > -1) {
        array.splice(index, 1); // Remove the image from the array
      }
    };

    // Remove the image based on its view property
    switch (image.view) {
      case 'LSV':
        removeImage(vehicle.scratchOrgLsv);
        break;
      case 'RSV':
        removeImage(vehicle.scratchOrgRsv);
        break;
      case 'FV':
        removeImage(vehicle.scratchFvOrg);
        break;
      case 'TV':
        removeImage(vehicle.scratchTvOrg);
        break;
      case 'BV':
        removeImage(vehicle.scratchBvOrg);
        break;
      default:
        return res.status(400).json({ error: 'Invalid view specified' });
    }

    // Save the updated vehicle document
    const result = await vehicle.save();
    res.status(200).json(result);
  } catch (e) {
    console.error('Error deleting scratch image:', e);
    res.status(500).json({ error: `Error: ${e.message}` });
  }
});



// Route handlers
app.post('/api/updatevehicle', async (req, res) => {
  const { id, vehicleName, vehicleNumber, insuranceDueDate, istimaraDueDate, vehicleType, vehicleStatus } = req.body;
  try {
    await Vehicle.updateOne({ _id: id }, {
      $set: {
        vehicleName,
        vehicleNumber,
        insuranceDueDate,
        istimaraDueDate,
        vehicleType,
        vehicleStatus,
      },
    });
    res.json({ status: "ok", data: "updated" });
  } catch (error) {
    res.json({ status: "error", data: error });
  }
});
app.get('/api/vehicles/:vehicleNumber/images', async (req, res) => {
  try {
    const vehicle = await Scratch.findOne({ vehicleNumber: req.params.vehicleNumber });
    if (!vehicle) {
      return res.status(404).send('Vehicle not found');
    }

    const getLastElement = (arr) => (arr && arr.length > 0 ? arr[arr.length - 1] : '');

    res.json({
      LSV: getLastElement(vehicle.scratchLSV),
      RSV: getLastElement(vehicle.scratchRSV),
      FV: getLastElement(vehicle.scratchFV),
      BV: getLastElement(vehicle.scratchBV),
      TV: getLastElement(vehicle.scratchTV),
    });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.post('/api/vehicles/:vehicleNumber/scratch', async (req, res) => {
  const { vehicleNumber } = req.params;
  const { field, image } = req.body;

  if (!field || !image) {
    return res.status(400).send('Field and image data are required');
  }

  try {
    const scratch = await Scratch.findOne({ vehicleNumber });

    if (!scratch) {
      // If no scratch document exists for the vehicle, create one with the image in an array
      const newScratch = await Scratch.create({
        vehicleNumber,
        [field]: [image]
      });
      return res.json(newScratch);
    } else {
      // If a scratch document exists, append the new image to the existing array
      const updatedScratch = await Scratch.findOneAndUpdate(
        { vehicleNumber },
        { $push: { [field]: image } },
        { new: true }
      );
      return res.json(updatedScratch);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.post('/api/vehicles/:vehicleNumber/clearprev', async (req, res) => {
  const { vehicleNumber } = req.params;
  const { clickedImageIndex } = req.body;

  try {
    const viewFields = ['scratchLSV', 'scratchRSV', 'scratchFV', 'scratchBV', 'scratchTV'];

    if (clickedImageIndex >= 0 && clickedImageIndex < viewFields.length) {
      const arrayField = viewFields[clickedImageIndex];
      const scratch = await Scratch.findOne({ vehicleNumber });

      if (!scratch) {
        return res.status(404).send('Vehicle not found');
      }

      // Remove the last entry from the specified array field
      if (scratch[arrayField] && scratch[arrayField].length > 1) {
        scratch[arrayField].pop(); // Remove the last element
        await scratch.save();
      }

      res.json(scratch);
    } else {
      res.status(400).send('Invalid image index');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});


app.post('/api/vehicles/:vehicleNumber/clear', async (req, res) => {
  const { vehicleNumber } = req.params;
  const { clickedImageIndex } = req.body;

  try {
    const viewFields = ['scratchLSV', 'scratchRSV', 'scratchFV', 'scratchBV', 'scratchTV'];

    if (clickedImageIndex >= 0 && clickedImageIndex < viewFields.length) {
      const arrayField = viewFields[clickedImageIndex];
      const scratch = await Scratch.findOne({ vehicleNumber });

      if (!scratch) {
        return res.status(404).send('Vehicle not found');
      }

      // Remove the last entry from the specified array field
      if (scratch[arrayField] && scratch[arrayField].length > 1) {
        scratch[arrayField].splice(1); // Keep only the first element
        await scratch.save();
      }

      res.json(scratch);
    } else {
      res.status(400).send('Invalid image index');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.post('/api/updatedriver', async (req, res) => {
  const { id, driverName, driverId, driverPin, driverPassword, mobileNumber, driverLicenceNumber, driverLicenceExpiryDate } = req.body;
  try {
    const result = await Driver.updateOne(
      { _id: id },
      {
        $set: {
          driverName,
          driverId,
          driverPin,
          driverPassword,
          mobileNumber,
          driverLicenceNumber,
          driverLicenceExpiryDate,
        },
      },
    );

    if (result.modifiedCount === 0) {
      throw new Error('No document was updated');
    }

    res.json({ status: "ok", data: "updated" });
  } catch (error) {
    res.json({ status: "error", data: error.message });
  }
});


app.post('/api/vehicles', upload.single('vehiclephoto'), async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const fileName = req.body.imagename;
    console.log(fileName);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = await uploadTos3Bucket(file, fileName);
    const vehicle = new Vehicle({
      vehicleName: req.body.vehiclename,
      vehicleNumber: req.body.vehiclenumber,
      insuranceDueDate: req.body.insurancedue,
      istimaraDueDate: req.body.isthimaradue,
      vehicleType: req.body.vehicletype,
      odometerReading: req.body.odometerreading,
      vehiclePhoto: imageUrl, // This now stores the base64 string
    });
    const result = await vehicle.save();

    const scratch = new Scratch({
      vehicleName: req.body.vehiclename,
      vehicleNumber: req.body.vehiclenumber,
      vehicleType: req.body.vehicletype,
      scratchLSV: [req.body.scratchLSV].filter(Boolean), // Only add if not null
      scratchRSV: [req.body.scratchRSV].filter(Boolean),
      scratchFV: [req.body.scratchFV].filter(Boolean),
      scratchBV: [req.body.scratchBV].filter(Boolean),
      scratchTV: [req.body.scratchTV].filter(Boolean),
    });

    await scratch.save();

    res.status(201).send(result);
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
});



app.post('/api/drivers', async (req, res) => {
  try {
    const driver = new Driver({
      driverId: req.body.driverid,
      driverPassword: req.body.driverpassword,
      driverName: req.body.drivername,
      mobileNumber: req.body.drivermobile,
      driverLicenceNumber: req.body.driverlicenceno,
      driverLicenceExpiryDate: req.body.driverlicenceexp,
    });

    const result = await driver.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.get('/api/driverCount', async (req, res) => {
  try {
    const count = await Driver.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get('/api/lastDriverID', async (req, res) => {
  try {
    const lastDriver = await Driver.findOne().sort({ _id: -1 }); // Get the most recent driver document
    const lastDriverID = lastDriver ? lastDriver.driverId : null;
    res.json({ lastDriverID });
    console.log(lastDriverID)
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get('/api/checkDriverID/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Driver.exists({ driverid: id });
    res.json({ exists: !!exists });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});


app.post('/api/trips', async (req, res) => {
  const {
    tripStartLocation,
    tripStartLatLng,
    tripDestination,
    tripDestinationLatLng,
    vehicleNumber,
    driverId,
    tripDate,
    tripEndDate,
    tripType,
    odometerReading,
    remunarationType,
    tripRemunaration,
  } = req.body;

  try {
    // Check if the vehicle exists in the database
    const vehicle = await Vehicle.findOne({ vehicleNumber });
    if (!vehicle) {
      return res.status(400).json({ error: "Vehicle not found." });
    }

    // Check if the driver exists in the database
    const driver = await Driver.findOne({ driverId });
    if (!driver) {
      return res.status(400).json({ error: "Driver not found." });
    }

    // Generate a unique trip number
    const tripCount = await Trip.countDocuments();
    const tripNumber = `TR${String(tripCount + 1).padStart(3, '0')}`;

    // Create a new trip
    const trip = new Trip({
      tripNumber,
      tripStartLocation,
      tripStartLatLng, // Latitude and longitude for start location
      tripDestination,
      tripDestinationLatLng, // Latitude and longitude for destination
      vehicleNumber,
      driverId,
      tripDate,
      tripEndDate,
      tripType,
      odometerReading,
      remunarationType,
      tripRemunaration,
    });

    // Save the trip to the database
    const savedTrip = await trip.save();

    // Update the driver with the trip ID
    await Driver.updateOne(
      { driverId },
      { $push: { trips: savedTrip._id } }
    );

    // Respond with the saved trip
    res.status(201).send(savedTrip);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});


app.get('/api/trips', async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.json(trips);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.post('/api/trips/updateTrip', async (req, res) => {
  const {
    id,
    tripNumber,
    driverId,
    vehicleNumber,
    tripDate,
    tripEndDate,
    tripStartLocation,
    tripDestination,
    tripType,
    remunarationType,
    tripRemunaration
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Trip ID is required' });
  }

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      {
        tripNumber,
        driverId,
        vehicleNumber,
        tripDate,
        tripEndDate,
        tripStartLocation,
        tripDestination,
        tripType,
        remunarationType,
        tripRemunaration
      },
      { new: true } // Return the updated document
    );

    if (!updatedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.status(200).json({ message: 'Trip updated successfully', updatedTrip });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

app.post('/api/notes/:type', async (req, res) => {
  const { type } = req.params;
  const { id, noteContent } = req.body;

  try {
    if (type === 'drivers') {
      const driver = await Driver.findOne({ driverId: id });
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      driver.notesAboutDriver = driver.notesAboutDriver ? `${driver.notesAboutDriver}\n${noteContent}` : noteContent;
      await driver.save();
      res.status(200).json({ message: 'Note added to driver' });
    } else if (type === 'vehicles') {
      const vehicle = await Vehicle.findOne({ vehicleNumber: id });
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      vehicle.notesAboutVehicle = vehicle.notesAboutVehicle ? `${vehicle.notesAboutVehicle}\n${noteContent}` : noteContent;
      await vehicle.save();
      res.status(200).json({ message: 'Note added to vehicle' });
    } else {
      res.status(400).json({ message: 'Invalid note type' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/notes', async (req, res) => {
  try {
    const driverNotes = await Driver.find({ notesAboutDriver: { $ne: null } }, { driverId: 1, notesAboutDriver: 1 })
      .sort({ _id: -1 })
      .limit(20)
      .lean();

    const vehicleNotes = await Vehicle.find({ notesAboutVehicle: { $ne: null } }, { vehicleNumber: 1, notesAboutVehicle: 1 })
      .sort({ _id: -1 })
      .limit(20)
      .lean();

    const combinedNotes = [
      ...driverNotes.map(note => ({ type: 'driver', id: note.driverId, content: note.notesAboutDriver, _id: note._id })),
      ...vehicleNotes.map(note => ({ type: 'vehicle', id: note.vehicleNumber, content: note.notesAboutVehicle, _id: note._id }))
    ].sort((a, b) => new Date(b._id) - new Date(a._id));

    res.json(combinedNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (month < 10) month = `0${month}`;
  let day = now.getDate();
  if (day < 10) day = `0${day}`;
  return `${year}-${month}-${day}`;
};

app.get('/api/tripCount', async (req, res) => {
  try {
    const count = await Trip.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get('/api/lastTripID', async (req, res) => {
  try {
    const lastTrip = await Trip.findOne().sort({ _id: -1 }); // Get the most recent trip document
    const lastTripID = lastTrip ? lastTrip.tripNumber : null;
    res.json({ lastTripID });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get('/api/checkTripID/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Trip.exists({ tripNumber: id });
    res.json({ exists: !!exists });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});


app.get('/api/monthlyTrips', async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const count = await Trip.countDocuments({
      tripDate: { $gte: thisMonthStart, $lt: nextMonthStart }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get('/api/weeklyTrips', async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    const count = await Trip.countDocuments({
      tripDate: { $gte: lastWeek }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get('/api/dailyTrips', async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const count = await Trip.countDocuments({
      tripDate: { $gte: today, $lt: tomorrow }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get('/api/allTrips', async (req, res) => {
  try {
    const trips = await Trip.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleNumber",
          foreignField: "vehicleNumber",
          as: "vehicleDetails",
          pipeline: [
            {
              $project: {
                vehicleName: 1,
                vehicleNumber: 1,
                vehicleStatus: 1,
                vehicleType: 1,
                vehiclePhoto: 1,
                vehicleLocation: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$vehicleDetails",
        },
      },
    ]);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post('/api/trips/:id/extend', async (req, res) => {
  const { id } = req.params;
  const { tripEndDate } = req.body;

  try {
    const updateResult = await Trip.updateOne({ _id: id }, { $set: { tripEndDate } });
    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ status: "error", message: "Trip not found or no changes made" });
    }
    res.json({ status: "ok", data: "Trip extended successfully" });
  } catch (error) {
    console.error('Error extending trip:', error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});


app.post('/api/vehicles/:vehicleId/scratch', upload.none(), async (req, res) => {
  const { vehicleId } = req.params;
  const { scratchImage } = req.body;

  if (!scratchImage) {
    return res.status(400).send('No image provided');
  }

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).send('Vehicle not found');
    }

    vehicle.scratchLine.push(scratchImage);
    await vehicle.save();

    res.status(200).send('Scratch image saved successfully');
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.get('/api/dueDates', async (req, res) => {
  try {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    // Fetch insurance and istimara due dates from vehicles
    const vehicles = await Vehicle.find({
      $or: [
        { insuranceDueDate: { $lte: oneWeekFromNow } },
        { istimaraDueDate: { $lte: oneWeekFromNow } }
      ]
    }, 'vehicleNumber insuranceDueDate istimaraDueDate');

    // Fetch driver licence expiry dates
    const drivers = await Driver.find({
      driverLicenceExpiryDate: { $lte: oneWeekFromNow }
    }, 'driverId driverLicenceExpiryDate');

    // Fetch next oil and tyre change dates from workshop movements
    const workshopMovements = await WorkshopMovement.find({
      $or: [
        { nextOilChange: { $lte: oneWeekFromNow } },
        { nextTyreChange: { $lte: oneWeekFromNow } }
      ]
    }, 'vehicleNumber nextOilChange nextTyreChange');

    res.json({
      vehicles,
      drivers,
      workshopMovements
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

