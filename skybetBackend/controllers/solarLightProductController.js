import SolarLightProduct from '../models/SolarLightProduct.js';

// Create
export const createSolarLightProduct = async (req, res) => {
  try {
    const { subtitle, name, power, time, type, description } = req.body;
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await SolarLightProduct.create({ subtitle, name, power, time, type, description, list, img });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read all
export const getAllSolarLightProducts = async (req, res) => {
  try {
    const docs = await SolarLightProduct.find();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read by ID
export const getSolarLightProductById = async (req, res) => {
  try {
    const doc = await SolarLightProduct.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateSolarLightProduct = async (req, res) => {
  try {
    const { subtitle, name, power, time, type, description } = req.body;
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await SolarLightProduct.findByIdAndUpdate(
      req.params.id,
      { subtitle, name, power, time, type, description, list, img },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteSolarLightProduct = async (req, res) => {
  try {
    const doc = await SolarLightProduct.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted', doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
