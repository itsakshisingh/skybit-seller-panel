import HomeService from '../models/HomeService.js';

// Create HomeService
export const createHomeService = async (req, res) => {
  const { name, title, description, list, category } = req.body;

  if (!name || !title || !description || !category) {
    return res.status(400).json({ message: 'name, title, description, and category are required' });
  }

  try {
    const homeService = await HomeService.create({ name, title, description, list, category });
    res.status(201).json(homeService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all HomeServices
export const getHomeServices = async (req, res) => {
  try {
    const homeServices = await HomeService.find().sort({ createdAt: -1 });
    res.json(homeServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get HomeService by ID
export const getHomeServiceById = async (req, res) => {
  try {
    const homeService = await HomeService.findById(req.params.id);
    if (!homeService) return res.status(404).json({ message: 'HomeService not found' });
    res.json(homeService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update HomeService
export const updateHomeService = async (req, res) => {
  const { name, title, description, list, category } = req.body;

  try {
    const homeService = await HomeService.findByIdAndUpdate(
      req.params.id,
      { name, title, description, list, category },
      { new: true, runValidators: true }
    );

    if (!homeService) return res.status(404).json({ message: 'HomeService not found' });
    res.json(homeService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete HomeService
export const deleteHomeService = async (req, res) => {
  try {
    const homeService = await HomeService.findByIdAndDelete(req.params.id);
    if (!homeService) return res.status(404).json({ message: 'HomeService not found' });
    res.json({ message: 'HomeService deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
