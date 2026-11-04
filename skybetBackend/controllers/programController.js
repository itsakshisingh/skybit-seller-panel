import Program from '../models/Program.js';

// Create Program
export const createProgram = async (req, res) => {
  const { icon, title, description } = req.body;
  if (!icon || !title) {
    return res.status(400).json({ message: 'Icon and title are required' });
  }
  try {
    const program = await Program.create({ icon, title, description });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Programs
export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Program by ID
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Program
export const updateProgram = async (req, res) => {
  try {
    const { icon, title, description } = req.body;
    const updateData = { icon, title, description };
    const program = await Program.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Program
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
