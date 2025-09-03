const express = require('express');
const router = express.Router();
const pdsController = require('../controllers/pdsController');

router.post('/', pdsController.createPDS);
router.get('/', pdsController.getAllPDS);
// Add more routes for update, delete, etc.

module.exports = router;