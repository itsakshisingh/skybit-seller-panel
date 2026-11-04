// Get by category
export const getSolutionHeroesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const docs = await SolutionHero.find({ category });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import SolutionHero from '../models/SolutionHero.js';

// Create
export const createSolutionHero = async (req, res) => {
  try {
    const { subtitle, title, desp, category } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await SolutionHero.create({ subtitle, title, desp, img, category });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read all
export const getAllSolutionHeroes = async (req, res) => {
  try {
    const docs = await SolutionHero.find();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read by ID
export const getSolutionHeroById = async (req, res) => {
  try {
    const doc = await SolutionHero.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateSolutionHero = async (req, res) => {
  try {
    const { subtitle, title, desp, category } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await SolutionHero.findByIdAndUpdate(
      req.params.id,
      { subtitle, title, desp, img, category },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteSolutionHero = async (req, res) => {
  try {
    const doc = await SolutionHero.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted', doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
