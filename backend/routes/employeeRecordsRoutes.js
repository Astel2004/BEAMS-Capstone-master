const express = require('express');
const router = express.Router();
const employeeRecordsController = require('../controllers/employeeRecordsController');

router.post('/', employeeRecordsController.createEmployeeRecords);
router.get('/', employeeRecordsController.getAllEmployeeRecords);
// Add more routes for update, delete, etc.

module.exports = router;