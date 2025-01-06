const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    managerName: { type: String, required: true },
    managerUsername: { type: String, required: true },
    managerPassword: { type: String, required: true },

});

module.exports = mongoose.model('Manager', managerSchema);