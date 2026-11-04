import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  experience: { type: String, required: true },
  reason: { type: String },
}, { timestamps: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
