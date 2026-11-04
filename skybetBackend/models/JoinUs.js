import mongoose from 'mongoose';

const heroJoinSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  desp: {
    type: String,
    trim: true,
  },
});

const statsSchema = new mongoose.Schema({
  totalNo: {
    type: Number,
    default: 0,
  },
  noOfState: {
    type: Number,
    default: 0,
  },
  noOfProject: {
    type: Number,
    default: 0,
  },
  noOfClient: {
    type: Number,
    default: 0,
  },
});

const howWeWorkSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  desp: {
    type: String,
    trim: true,
  },
  stats: {
    type: statsSchema,
    default: () => ({}),
  },
});

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const joinUsSchema = new mongoose.Schema(
  {
    heroJoin: {
      type: heroJoinSchema,
      required: true,
    },
    howWeWork: {
      type: howWeWorkSchema,
      required: true,
    },
    teamMembers: [teamMemberSchema],
  },
  { timestamps: true }
);

const JoinUs = mongoose.model('JoinUs', joinUsSchema);

export default JoinUs;
