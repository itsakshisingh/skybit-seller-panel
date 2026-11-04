import NeedHero from '../models/NeedHero.js';

// Create NeedHero
export const createNeedHero = async (req, res) => {
  const { title, category } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !img || !category) {
    return res.status(400).json({ message: 'Title, img and category are required' });
  }

  try {
    const needHero = await NeedHero.create({ title, img, category });
    res.status(201).json(needHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all NeedHeros
export const getNeedHeros = async (req, res) => {
  try {
    const needHeros = await NeedHero.find().sort({ createdAt: -1 });
    res.json(needHeros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get NeedHero by ID
export const getNeedHeroById = async (req, res) => {
  try {
    const needHero = await NeedHero.findById(req.params.id);
    if (!needHero) return res.status(404).json({ message: 'NeedHero not found' });
    res.json(needHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update NeedHero
export const updateNeedHero = async (req, res) => {
  try {
    const { title, category } = req.body;
    const updateData = { title, category };

    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const needHero = await NeedHero.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!needHero) return res.status(404).json({ message: 'NeedHero not found' });
    res.json(needHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete NeedHero
export const deleteNeedHero = async (req, res) => {
  try {
    const needHero = await NeedHero.findByIdAndDelete(req.params.id);
    if (!needHero) return res.status(404).json({ message: 'NeedHero not found' });
    res.json({ message: 'NeedHero deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
