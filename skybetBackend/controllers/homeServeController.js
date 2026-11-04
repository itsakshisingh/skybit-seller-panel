import HomeServe from '../models/HomeServe.js';

// Create HomeServe
export const createHomeServe = async (req, res) => {
  const { name } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !img) {
    return res.status(400).json({ message: 'Name and img are required' });
  }

  try {
    const homeServe = await HomeServe.create({ name, img });
    res.status(201).json(homeServe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all HomeServes
export const getHomeServes = async (req, res) => {
  try {
    const homeServes = await HomeServe.find().sort({ createdAt: -1 });
    res.json(homeServes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get HomeServe by ID
export const getHomeServeById = async (req, res) => {
  try {
    const homeServe = await HomeServe.findById(req.params.id);
    if (!homeServe) return res.status(404).json({ message: 'HomeServe not found' });
    res.json(homeServe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update HomeServe
export const updateHomeServe = async (req, res) => {
  try {
    const updateData = { name: req.body.name };
    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const homeServe = await HomeServe.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!homeServe) return res.status(404).json({ message: 'HomeServe not found' });
    res.json(homeServe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete HomeServe
export const deleteHomeServe = async (req, res) => {
  try {
    const homeServe = await HomeServe.findByIdAndDelete(req.params.id);
    if (!homeServe) return res.status(404).json({ message: 'HomeServe not found' });
    res.json({ message: 'HomeServe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
