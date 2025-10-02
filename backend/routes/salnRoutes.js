const express = require("express");
const router = express.Router();
const multer = require("multer");
const salnController = require("../controllers/salnController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/saln"); // Save files to uploads/saln folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// File upload route (like PDS)
router.post("/", upload.single("file"), salnController.createSALN);

// For form-only (no file upload)
router.post("/form", salnController.createSALNForm);

// Get all SALNs
router.get("/", salnController.getAllSALN);

// Update a SALN by ID
router.put("/:id", salnController.updateSALN);

// Delete a SALN by ID
router.delete("/:id", salnController.deleteSALN);

module.exports = router;
