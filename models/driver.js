const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    driverId: { type: String, required: true, unique: true },
    driverPassword: { type: String, required: true },
    driverName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    location: { type: String, default: null },
    driverPin: { type: Number, default: null },
    driverLicenceNumber: { type: String, required: true },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }], // Assuming Trip is another model
    driverLicenceExpiryDate: { type: Date, required: true },
    notesAboutDriver: { type: String, default: null },
    driverPhoto: { type: String, default: null },
});

module.exports = mongoose.model('Driver', driverSchema);

// anulisba
// aCZHjI8NyQLOHV2d