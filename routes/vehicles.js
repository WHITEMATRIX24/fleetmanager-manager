const express = require('express');
const router = express.Router();
const multer = require('multer');
const Vehicle = require('../models/vehicle'); // Adjust the path as needed
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'scratchuploads/'); // Scratch uploads directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
const upload = multer({ storage: storage });

// Route to handle POST request for saving scratch image to a vehicle
router.post('/api/vehicles/:vehicleNumber/scratch', upload.single('image'), async (req, res) => {
    const { vehicleNumber } = req.params;
    const { image } = req.body;

    try {
        const vehicle = await Vehicle.findOne({ vehicleNumber });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        vehicle.scratchPhoto.push(req.file.path); // Save the file path to scratchPhoto array
        await vehicle.save();

        res.status(200).json({ message: 'Image saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all vehicles
router.get('/vehicles', async (req, res) => {
    const { vehicleNumber } = req.query;
    try {
        let vehicles;
        if (vehicleNumber) {
            vehicles = await Vehicle.find({ vehicleNumber });
        } else {
            vehicles = await Vehicle.find();
        }
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE vehicle by ID
router.delete('/vehicles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Vehicle.findByIdAndDelete(id);
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error });
    }
});

module.exports = router;
