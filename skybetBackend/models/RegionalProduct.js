import mongoose from 'mongoose';

const regionalProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    place: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      trim: true,
    },
    descp: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const RegionalProduct = mongoose.model('RegionalProduct', regionalProductSchema);

export default RegionalProduct;
