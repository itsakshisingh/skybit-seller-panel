import mongoose from 'mongoose';

const companyGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CompanyGallery = mongoose.model('CompanyGallery', companyGallerySchema);

export default CompanyGallery;
