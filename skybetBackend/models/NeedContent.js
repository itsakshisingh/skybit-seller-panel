import mongoose from 'mongoose';

const needContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    subheading: [
      {
        type: String,
        trim: true,
      },
    ],
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
      enum: ['road', 'parking'],
    },
  },
  { timestamps: true }
);

const NeedContent = mongoose.model('NeedContent', needContentSchema);

export default NeedContent;
