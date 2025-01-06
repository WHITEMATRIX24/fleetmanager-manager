const express = require('express');
const router = express.Router();
const WorkshopMovement = require('../models/workshopMovement');
const Vehicle = require('../models/vehicle');

// GET all workshop movements
router.get('/workshop-movements', async (req, res) => {
    try {
        const movements = await WorkshopMovement.find();
        res.json(movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// POST a new workshop movement
router.post('/workshop-movements', async (req, res) => {
    try {
        const movement = new WorkshopMovement(req.body);
        const result = await movement.save();
        res.status(201).send(result);
    } catch (error) {
        console.error('Error adding workshop visit:', error); // Log the error details
        res.status(400).json({ message: error.message });
    }
});

// POST a new workshop movement

// GET workshop movements for a specific vehicle
router.get('/workshop-movements/:vehicleNumber', async (req, res) => {
    try {
        const vehicleNumber = req.params.vehicleNumber;
        const movements = await WorkshopMovement.find({ vehicleNumber });
        const vehicle = await Vehicle.findOne({ vehicleNumber });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json({
            movements,
            lastServiceDate: vehicle.lastServiceDate,
            tireChangeDate: vehicle.tireChangeDate,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
