// Get NeedContents by category
export const getNeedContentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await NeedContent.find({ category }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import NeedContent from '../models/NeedContent.js';

// Create NeedContent
export const createNeedContent = async (req, res) => {
  const { title, heading, subheading, list, category } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !heading || !img || !category) {
    return res.status(400).json({ message: 'Title, heading, img and category are required' });
  }

  try {
    const parsedSubheading = Array.isArray(subheading)
      ? subheading
      : typeof subheading === 'string'
      ? JSON.parse(subheading)
      : [];

    const parsedList = Array.isArray(list)
      ? list
      : typeof list === 'string'
      ? JSON.parse(list)
      : [];

    const needContent = await NeedContent.create({
      title,
      heading,
      subheading: parsedSubheading,
      list: parsedList,
      img,
      category,
    });
    res.status(201).json(needContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all NeedContents
export const getNeedContents = async (req, res) => {
  try {
    const needContents = await NeedContent.find().sort({ createdAt: -1 });
    res.json(needContents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get NeedContent by ID
export const getNeedContentById = async (req, res) => {
  try {
    const needContent = await NeedContent.findById(req.params.id);
    if (!needContent) return res.status(404).json({ message: 'NeedContent not found' });
    res.json(needContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update NeedContent
export const updateNeedContent = async (req, res) => {
  try {
    const { title, heading, subheading, list, category } = req.body;
    const updateData = { title, heading, category };

    if (subheading) {
      updateData.subheading = Array.isArray(subheading)
        ? subheading
        : typeof subheading === 'string'
        ? JSON.parse(subheading)
        : [];
    }

    if (list) {
      updateData.list = Array.isArray(list)
        ? list
        : typeof list === 'string'
        ? JSON.parse(list)
        : [];
    }

    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const needContent = await NeedContent.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!needContent) return res.status(404).json({ message: 'NeedContent not found' });
    res.json(needContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete NeedContent
export const deleteNeedContent = async (req, res) => {
  try {
    const needContent = await NeedContent.findByIdAndDelete(req.params.id);
    if (!needContent) return res.status(404).json({ message: 'NeedContent not found' });
    res.json({ message: 'NeedContent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
