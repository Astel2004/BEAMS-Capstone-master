const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentsController = require('../controllers/documentsController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents'); // Save files to uploads/documents folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Use upload.single('file') for file upload
router.post('/', upload.single('file'), documentsController.createDocuments);
router.get('/', documentsController.getAllDocuments);
// Add more routes for update, delete, etc.

module.exports = router;