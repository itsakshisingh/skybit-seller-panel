import Testimonial from '../models/Testimonial.js';

// Create testimonial
export const createTestimonial = async (req, res) => {
  const { name, rating, description } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !img || !rating || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const testimonial = await Testimonial.create({ name, img, rating, description });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get testimonial by ID
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      rating: req.body.rating,
      description: req.body.description,
    };
    if (req.file) updateData.img = `/uploads/${req.file.filename}`;

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
