import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
});

const addressSchema = new mongoose.Schema({
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
});

const infoSectionSchema = new mongoose.Schema({
  images: [{ type: String }],
  descp: { type: String },
  list: [{ type: String }],
});

const contactPageSchema = new mongoose.Schema({
  hero: heroSectionSchema,
  address: addressSchema,
  infoSections: [infoSectionSchema],
});

const ContactPage = mongoose.model('ContactPage', contactPageSchema);

export default ContactPage;
