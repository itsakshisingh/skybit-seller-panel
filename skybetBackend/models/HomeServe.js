import mongoose from 'mongoose';

const homeServeSchema = new mongoose.Schema(
  {
    name: {
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

const HomeServe = mongoose.model('HomeServe', homeServeSchema);

export default HomeServe;
