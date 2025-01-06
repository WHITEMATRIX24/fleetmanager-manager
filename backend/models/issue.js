const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    tripNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    driverId: { type: String, required: true }, // assuming driverId is a string
    issueType: { type: String, required: true },
    issueDetail: { type: String, required: true },
    issueImage: { type: String, default: null },
});

module.exports = mongoose.model('Issue', issueSchema);
