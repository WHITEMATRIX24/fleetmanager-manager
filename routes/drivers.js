const express = require('express');
const router = express.Router();
const Driver = require('../models/driver');

// GET all drivers
router.get('/drivers', async (req, res) => {
    console.log('GET request received for /drivers');
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Driver.findByIdAndDelete(id);
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting driver', error });
    }
});
module.exports = router;
