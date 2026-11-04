import mongoose from 'mongoose';

const homeServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    list: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ['solar', 'other'],
      required: true,
    },
  },
  { timestamps: true }
);

const HomeService = mongoose.model('HomeService', homeServiceSchema);

export default HomeService;
