const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');

router.post('/', documentsController.createDocuments);
router.get('/', documentsController.getAllDocuments);
// Add more routes for update, delete, etc.

module.exports = router;