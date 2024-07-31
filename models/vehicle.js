const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleName: { type: String, required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    insuranceDueDate: { type: Date, required: true },
    istimaraDueDate: { type: Date, required: true },
    vehicleType: { type: String, default: null },
    vehiclePhoto: { type: String, required: true },
    ownVehicle: { type: Boolean, default: null },
    insurancePhoto: { type: String, default: null },
    lastTyreChangeOdoReading: { type: Number, default: null },
    odometerReading: { type: Number, default: null },
    istimaraPhoto: { type: String, default: null },
    vehicleStatus: { type: String, default: null },
    vehicleLocation: { type: String, default: null },
    notesAboutVehicle: { type: String, default: null },
    rentalAgreement: { type: String, default: null },
    lastServiceDate: { type: Date, default: null },
    tireChangeDate: { type: Date, default: null },
    keyCustody: { type: String, default: null },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
