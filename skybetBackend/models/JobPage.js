import mongoose from 'mongoose';

// Hero Section Schema
const heroSectionSchema = new mongoose.Schema({
  subtitle: { type: String, trim: true },
  heading: { type: String, trim: true },
  description: { type: String, trim: true },
  img: { type: String, trim: true }, // image file path or URL
}, { _id: false });

// WeOffer Schema
const weOfferSchema = new mongoose.Schema({
  icon: { type: String, trim: true }, // icon name, emoji, or file path
  title: { type: String, trim: true },
  description: { type: String, trim: true },
});

// Additional Section Schema
const additionalSectionSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  descp: { type: String, trim: true },
  list: [{ type: String, trim: true }],
  img: { type: String, trim: true }, // image file path or URL
  imgHeading: { type: String, trim: true },
  imgdescription: { type: String, trim: true },
}, { _id: false });

const jobPageSchema = new mongoose.Schema({
  heroSection: heroSectionSchema,
  weOffer: [weOfferSchema],
  additionalSection: additionalSectionSchema,
}, { timestamps: true });

const JobPage = mongoose.model('JobPage', jobPageSchema);

export default JobPage;
