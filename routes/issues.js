const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');

router.get('/issues', async (req, res) => {
    const { type } = req.query;
    console.log(type);
    if (!type) {
        return res.status(400).json({ error: 'Type is required' });
    }

    try {
        const issues = await Issue.find({ issueType: type });
        res.json({ issues });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/issues/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedIssue = await Issue.findByIdAndDelete(id);
        if (!deletedIssue) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        res.json({ message: 'Issue deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
