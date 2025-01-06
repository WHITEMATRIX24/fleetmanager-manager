const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const Driver = require('../models/driver');
// Get all attendance records
router.get('/attendance', async (req, res) => {
  try {
    const drivers = await Driver.find({}, 'driverId driverName');
    const attendance = await Attendance.find();

    const driverAttendance = drivers.map((driver) => {
      const record = attendance.find(a => a.driverId === driver.driverId);
      return {
        driverId: driver.driverId,
        driverName: driver.driverName,
        attendanceRecords: record ? record.attendanceRecords : [],
      };
    });

    res.status(200).json(driverAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete('/drivers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the driver
    await Driver.findByIdAndDelete(id);

    // Remove the driver's attendance
    await Attendance.deleteMany({ driverId: id });

    res.status(200).json({ message: 'Driver and attendance records deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;  // Correctly export the router instance
