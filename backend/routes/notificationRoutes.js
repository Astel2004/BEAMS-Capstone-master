// backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  // Validate employeeId
  if (!employeeId || employeeId === "null") {
    return res.status(400).json({ error: "Invalid employee ID" });
  }
  try {
    const notifications = await Notification.find({ employeeId }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;