const mongoose = require('mongoose');

const workshopMovementSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true },
    workshopVisitDate: { type: Date, required: true },
    visitType: { type: String, default: null },
    nextOilChange: { type: String, default: null },
    nextTyreChange: { type: String, default: null },
    noOfDays: { type: Number, required: true },
    odometerReading: { type: Number, required: true },
    complaintDetail: { type: String, required: true },
    amountSpent: { type: Number, required: true },
});

module.exports = mongoose.model('WorkshopMovement', workshopMovementSchema);
