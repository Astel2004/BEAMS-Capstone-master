// backend/models/Notification.js
const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, default: "document" },
  status: { type: String, enum: ["approved", "rejected"], required: true },
  fileName: { type: String },
  date: { type: Date, default: Date.now },
  message: { type: String }
});
module.exports = mongoose.model('Notification', NotificationSchema);