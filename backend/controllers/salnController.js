const SALN = require('../models/SALN');

exports.createSALN = async (req, res) => {
  try {
    const saln = new SALN(req.body);
    await saln.save();
    res.status(201).json(saln);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload SALN document.' });
  }
};

exports.getAllSALN = async (req, res) => {
  try {
    const docs = await SALN.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SALN documents.' });
  }
};

// Add more functions for update, delete, etc.