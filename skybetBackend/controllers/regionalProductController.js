import RegionalProduct from '../models/RegionalProduct.js';

// Create RegionalProduct
export const createRegionalProduct = async (req, res) => {
  const { title, color, year, place, state, zone, descp, unit } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !img) {
    return res.status(400).json({ message: 'Title and image are required' });
  }

  try {
    const product = await RegionalProduct.create({ title, color, year, place, state, img, zone, descp, unit });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all RegionalProducts
export const getRegionalProducts = async (req, res) => {
  try {
    const products = await RegionalProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get RegionalProduct by ID
export const getRegionalProductById = async (req, res) => {
  try {
    const product = await RegionalProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'RegionalProduct not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update RegionalProduct
export const updateRegionalProduct = async (req, res) => {
  try {
    const { title, color, year, place, state, zone, descp, unit } = req.body;
    const updateData = { title, color, year, place, state, zone, descp, unit };

    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const product = await RegionalProduct.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: 'RegionalProduct not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete RegionalProduct
export const deleteRegionalProduct = async (req, res) => {
  try {
    const product = await RegionalProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'RegionalProduct not found' });
    res.json({ message: 'RegionalProduct deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
