const express = require('express');
const router = express.Router();
const multer = require('multer');
const salnController = require('../controllers/salnController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/saln'); // Save files to uploads/saln folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Use upload.single('file') for file upload
router.post('/', upload.single('file'), salnController.createSALN);
router.get('/', salnController.getAllSALN);
// Add more routes for update, delete, etc.

module.exports = router;