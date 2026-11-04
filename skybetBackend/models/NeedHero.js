import mongoose from 'mongoose';

const needHerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['road', 'parking'],
    },
  },
  { timestamps: true }
);

const NeedHero = mongoose.model('NeedHero', needHerSchema);

export default NeedHero;
