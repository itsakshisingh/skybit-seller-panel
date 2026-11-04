import HomeHead from '../models/HomeHead.js';

// Create homeHead
export const createHomeHead = async (req, res) => {
  const { heading, list, category } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!heading || !img || !category) {
    return res.status(400).json({ message: 'Heading, img and category are required' });
  }

  try {
    const parsedList = Array.isArray(list)
      ? list
      : typeof list === 'string'
      ? JSON.parse(list)
      : [];

    const homeHead = await HomeHead.create({ heading, list: parsedList, img, category });
    res.status(201).json(homeHead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all homeHeads
export const getHomeHeads = async (req, res) => {
  try {
    const homeHeads = await HomeHead.find().sort({ createdAt: -1 });
    res.json(homeHeads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get homeHead by ID
export const getHomeHeadById = async (req, res) => {
  try {
    const homeHead = await HomeHead.findById(req.params.id);
    if (!homeHead) return res.status(404).json({ message: 'HomeHead not found' });
    res.json(homeHead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update homeHead
export const updateHomeHead = async (req, res) => {
  try {
    const { heading, list, category } = req.body;
    const updateData = { heading, category };

    if (list) {
      updateData.list = Array.isArray(list)
        ? list
        : typeof list === 'string'
        ? JSON.parse(list)
        : [];
    }

    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const homeHead = await HomeHead.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!homeHead) return res.status(404).json({ message: 'HomeHead not found' });
    res.json(homeHead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete homeHead
export const deleteHomeHead = async (req, res) => {
  try {
    const homeHead = await HomeHead.findByIdAndDelete(req.params.id);
    if (!homeHead) return res.status(404).json({ message: 'HomeHead not found' });
    res.json({ message: 'HomeHead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
