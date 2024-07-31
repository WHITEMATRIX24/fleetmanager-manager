const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

router.get('/tripNotifications', async (req, res) => {
    try {
        const trips = await Trip.find();
        const notifications = trips.map(trip => trip.notification).filter(notification => notification !== null);
        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trip notifications', error });
    }
});

module.exports = router;
