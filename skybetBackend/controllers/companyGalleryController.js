import CompanyGallery from '../models/CompanyGallery.js';

// Create CompanyGallery
export const createCompanyGallery = async (req, res) => {
  const { title } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!img) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const gallery = await CompanyGallery.create({ title, img });
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all CompanyGallery
export const getCompanyGallery = async (req, res) => {
  try {
    const gallery = await CompanyGallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get CompanyGallery by ID
export const getCompanyGalleryById = async (req, res) => {
  try {
    const gallery = await CompanyGallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'CompanyGallery not found' });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update CompanyGallery
export const updateCompanyGallery = async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const gallery = await CompanyGallery.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!gallery) return res.status(404).json({ message: 'CompanyGallery not found' });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete CompanyGallery
export const deleteCompanyGallery = async (req, res) => {
  try {
    const gallery = await CompanyGallery.findByIdAndDelete(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'CompanyGallery not found' });
    res.json({ message: 'CompanyGallery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
