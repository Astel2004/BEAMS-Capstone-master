const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdsController = require('../controllers/pdsController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pds'); // Save files to uploads/pds folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Use upload.single('file') for file upload
router.post('/', upload.single('file'), pdsController.createPDS);
router.get('/', pdsController.getAllPDS);
// Add more routes for update, delete, etc.

module.exports = router;