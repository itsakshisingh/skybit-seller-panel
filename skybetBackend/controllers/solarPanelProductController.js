import SolarPanelProduct from '../models/SolarPanelProduct.js';

// Create
export const createSolarPanelProduct = async (req, res) => {
  try {
    const { subtitle, name, percentage, time, place, description } = req.body;
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await SolarPanelProduct.create({ subtitle, name, percentage, time, place, description, list, img });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read all
export const getAllSolarPanelProducts = async (req, res) => {
  try {
    const docs = await SolarPanelProduct.find();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read by ID
export const getSolarPanelProductById = async (req, res) => {
  try {
    const doc = await SolarPanelProduct.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateSolarPanelProduct = async (req, res) => {
  try {
    const { subtitle, name, percentage, time, place, description } = req.body;
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await SolarPanelProduct.findByIdAndUpdate(
      req.params.id,
      { subtitle, name, percentage, time, place, description, list, img },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteSolarPanelProduct = async (req, res) => {
  try {
    const doc = await SolarPanelProduct.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted', doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
