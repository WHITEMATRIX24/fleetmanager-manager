const mongoose = require('mongoose');

const scratchSchema = new mongoose.Schema({
    vehicleName: { type: String, required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    vehicleType: { type: String, default: null },
    scratchLSV: { type: [String], default: [] },
    scratchRSV: { type: [String], default: [] },
    scratchFV: { type: [String], default: [] },
    scratchTV: { type: [String], default: [] },
    scratchBV: { type: [String], default: [] },
    scratchOrgLsv: { type: [String], default: [] },
    scratchOrgRsv: { type: [String], default: [] },
    scratchFvOrg: { type: [String], default: [] },
    scratchTvOrg: { type: [String], default: [] },
    scratchBvOrg: { type: [String], default: [] },
});

module.exports = mongoose.model('Scratch', scratchSchema);