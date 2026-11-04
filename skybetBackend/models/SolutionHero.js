import mongoose from 'mongoose';

const solutionHeroSchema = new mongoose.Schema({
  subtitle: { type: String },
  title: { type: String, required: true },
  desp: { type: String },
  img: { type: String },
  category: {
    type: String,
    enum: ['solarPanel', 'solarLight', 'solarInstallation'],
    required: true
  }
});

const SolutionHero = mongoose.model('SolutionHero', solutionHeroSchema);

export default SolutionHero;
