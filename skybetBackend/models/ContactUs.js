import mongoose from 'mongoose';

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    organisationName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

export default ContactUs;
