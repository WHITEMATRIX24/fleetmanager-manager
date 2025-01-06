// routes/managers.js

const express = require('express');
const router = express.Router();
const Manager = require('../models/manager'); // Ensure the path is correct

router.post('/changePassword', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    console.log('Received request to change password for:', username);

    try {
        // Find the manager by username
        const manager = await Manager.findOne({ managerUsername: username });
        if (!manager) {
            console.log('Manager not found for username:', username);
            return res.json({ success: false, message: 'Manager not found' });
        }

        // Check if the current password is correct (insecure method)
        if (currentPassword !== manager.managerPassword) {
            console.log('Current password is incorrect for username:', username);
            return res.json({ success: false, message: 'Current password is incorrect' });
        }

        // Update the password in the database (store newPassword as plain text)
        manager.managerPassword = newPassword;
        await manager.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
