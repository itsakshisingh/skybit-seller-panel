import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  descp: { type: String },
  img: { type: String }
});

const techItemSchema = new mongoose.Schema({
  type: { type: String },
  name: { type: String },
  desp: { type: String },
  list: [{ type: String }],
  img: { type: String }
});

const ourTechnologySchema = new mongoose.Schema({
  heroSection: heroSectionSchema,
  techItems: [techItemSchema]
});

const OurTechnology = mongoose.model('OurTechnology', ourTechnologySchema);

export default OurTechnology;
