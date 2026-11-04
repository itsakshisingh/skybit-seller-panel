import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  desp: { type: String },
  img: { type: String },
});

const foundationSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desp: { type: String },
});

const chooseSolarSchema = new mongoose.Schema({
  img: { type: String },
  name: { type: String },
  desp: { type: String },
});

const whereSolarFitsSchema = new mongoose.Schema({
  list: [{ type: String }],
  img: { type: String },
});

const getKnowSolarSchema = new mongoose.Schema({
  heroSection: heroSectionSchema,
  foundation: [foundationSectionSchema],
  chooseSolar: [chooseSolarSchema],
  whereSolarFits: whereSolarFitsSchema,
});

const GetKnowSolar = mongoose.model('GetKnowSolar', getKnowSolarSchema);

export default GetKnowSolar;
