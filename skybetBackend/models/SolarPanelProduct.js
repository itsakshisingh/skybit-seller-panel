import mongoose from 'mongoose';

const solarPanelProductSchema = new mongoose.Schema({
  subtitle: { type: String },
  name: { type: String, required: true },
  percentage: { type: String },
  time: { type: String },
  place: { type: String },
  description: { type: String },
  list: [{ type: String }],
  img: { type: String }
});

const SolarPanelProduct = mongoose.model('SolarPanelProduct', solarPanelProductSchema);

export default SolarPanelProduct;
