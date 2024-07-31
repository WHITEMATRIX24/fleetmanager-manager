const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    tripNumber: { type: String, unique: true, default: null },
    tripStartLocation: { type: String, default: null },
    tripDestination: { type: String, default: null },
    vehicleNumber: { type: String, default: null },
    driverId: { type: String, default: null },
    tripDate: { type: Date, default: null },
    tripEndDate: { type: Date, default: null },
    triStartTime: { type: String, default: null },
    tripEndTime: { type: String, default: null },
    vehicleLocation: { type: String, default: null },
    tripType: { type: String, default: null },
    odometerReading: { type: Number, default: null },
    remunerationType: { type: String, default: null },
    tripRemunaration: { type: Number, default: null },
    notification: { type: String, default: null },
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
