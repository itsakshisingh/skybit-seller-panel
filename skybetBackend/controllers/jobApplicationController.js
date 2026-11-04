import JobApplication from '../models/JobApplication.js';

// Create
export const createJobApplication = async (req, res) => {
  try {
    const { fullName, email, phone, department, experience, reason } = req.body;
    const doc = await JobApplication.create({ fullName, email, phone, department, experience, reason });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read all
export const getAllJobApplications = async (req, res) => {
  try {
    const docs = await JobApplication.find();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read by ID
export const getJobApplicationById = async (req, res) => {
  try {
    const doc = await JobApplication.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateJobApplication = async (req, res) => {
  try {
    const { fullName, email, phone, department, experience, reason } = req.body;
    const doc = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { fullName, email, phone, department, experience, reason },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteJobApplication = async (req, res) => {
  try {
    const doc = await JobApplication.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted', doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
