const express = require('express');
const router = express.Router();
const salnController = require('../controllers/salnController');

router.post('/', salnController.createSALN);
router.get('/', salnController.getAllSALN);
// Add more routes for update, delete, etc.

module.exports = router;