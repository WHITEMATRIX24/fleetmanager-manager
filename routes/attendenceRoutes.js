const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

// Get all attendance records
router.get('/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;  // Correctly export the router instance
