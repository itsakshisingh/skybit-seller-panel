import mongoose from 'mongoose';

const homeHeadSchema = new mongoose.Schema(
  {
    heading: {
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
    img: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['SkybetEvergreen', 'SkybetUrban', 'SkybetIssl', 'SkybetAlto'],
    },
  },
  { timestamps: true }
);

const HomeHead = mongoose.model('HomeHead', homeHeadSchema);

export default HomeHead;
