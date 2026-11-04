import mongoose from 'mongoose';

const heroActionSchema = new mongoose.Schema({
  subtitle: { type: String },
  title: { type: String, required: true },
  desp: { type: String },
  img: { type: String }
});

const galleryImgSchema = new mongoose.Schema({
  img: { type: String },
  name: { type: String }
});

const videoBannerSchema = new mongoose.Schema({
  video: { type: String },
  title: { type: String },
  description: { type: String }
});

const statsSchema = new mongoose.Schema({
  cities: { type: String },
  installations: { type: String },
  mw: { type: String },
  states: { type: String }
});

const installationActionSchema = new mongoose.Schema({
  heroAction: heroActionSchema,
  galleryImgs: [galleryImgSchema],
  videoBanner: videoBannerSchema,
  stats: statsSchema
});

const InstallationAction = mongoose.model('InstallationAction', installationActionSchema);

export default InstallationAction;
