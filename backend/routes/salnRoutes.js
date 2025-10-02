const express = require("express");
const router = express.Router();
const salnController = require("../controllers/salnController");

// For form-only (no file upload)
router.post("/form", salnController.createSALNForm);

// Get all SALNs
router.get("/", salnController.getAllSALN);

// Update a SALN by ID
router.put("/:id", salnController.updateSALN);

// Delete a SALN by ID
router.delete("/:id", salnController.deleteSALN);

module.exports = router;
