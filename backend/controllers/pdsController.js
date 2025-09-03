const PDS = require('../models/PDS');

exports.createPDS = async (req, res) => {
  try {
    const pds = new PDS(req.body);
    await pds.save();
    res.status(201).json(pds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload PDS document.' });
  }
};

exports.getAllPDS = async (req, res) => {
  try {
    const docs = await PDS.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDS documents.' });
  }
};

// Add more functions for update, delete, etc.