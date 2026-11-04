import mongoose from 'mongoose';

const serviceHeroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desp: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceHero = mongoose.model('ServiceHero', serviceHeroSchema);

export default ServiceHero;
