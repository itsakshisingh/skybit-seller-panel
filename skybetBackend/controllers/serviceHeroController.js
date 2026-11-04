import ServiceHero from '../models/ServiceHero.js';

// Create ServiceHero
export const createServiceHero = async (req, res) => {
  const { title, desp } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !desp || !img) {
    return res.status(400).json({ message: 'Title, description and image are required' });
  }

  try {
    const serviceHero = await ServiceHero.create({ title, desp, img });
    res.status(201).json(serviceHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all ServiceHeros
export const getServiceHeros = async (req, res) => {
  try {
    const serviceHeros = await ServiceHero.find().sort({ createdAt: -1 });
    res.json(serviceHeros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ServiceHero by ID
export const getServiceHeroById = async (req, res) => {
  try {
    const serviceHero = await ServiceHero.findById(req.params.id);
    if (!serviceHero) return res.status(404).json({ message: 'ServiceHero not found' });
    res.json(serviceHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ServiceHero
export const updateServiceHero = async (req, res) => {
  try {
    const { title, desp } = req.body;
    const updateData = { title, desp };

    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const serviceHero = await ServiceHero.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!serviceHero) return res.status(404).json({ message: 'ServiceHero not found' });
    res.json(serviceHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete ServiceHero
export const deleteServiceHero = async (req, res) => {
  try {
    const serviceHero = await ServiceHero.findByIdAndDelete(req.params.id);
    if (!serviceHero) return res.status(404).json({ message: 'ServiceHero not found' });
    res.json({ message: 'ServiceHero deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
