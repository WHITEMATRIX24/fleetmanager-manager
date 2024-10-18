const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  driverId: {
    type: String,
    required: true,
  },
  attendanceRecords: [{
    checkInDate: String,
    checkInTime: String,
    checkOutDate: String,
    checkOutTime: String,
    overtime: Number
  }]
}, { collection: 'attendance' });  // Explicitly specify the collection name

module.exports = mongoose.model('Attendance', attendanceSchema);


