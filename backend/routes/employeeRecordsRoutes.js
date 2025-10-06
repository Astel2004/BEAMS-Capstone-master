const express = require('express');
const router = express.Router();
const multer = require('multer');
const employeeRecordsController = require('../controllers/employeeRecordsController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/employeeRecords'); // Save files to uploads/employeeRecords folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Use upload.single('file') for file upload
router.post('/', upload.single('file'), employeeRecordsController.createEgetAllEmployeeRecords);
router.get('/', employeeRecordsController.getAllEmployeeRecords);
router.post('/:id/approve', employeeRecordsController.approveEmployeeRecord);
// Add more routes for update, delete, etc.

module.exports = router;