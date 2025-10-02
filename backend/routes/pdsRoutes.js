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

// For form-only (no file)
router.post('/form', pdsController.createPDSForm);

router.get('/', pdsController.getAllPDS);

// Update a PDS by ID
router.put('/:id', pdsController.updatePDS);

// Delete a PDS by ID
router.delete('/:id', pdsController.deletePDS);

module.exports = router;