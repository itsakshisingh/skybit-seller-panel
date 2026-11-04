import mongoose from 'mongoose';

const solarLightProductSchema = new mongoose.Schema({
  subtitle: { type: String },
  name: { type: String, required: true },
  power: { type: String },
  time: { type: String },
  type: { type: String },
  description: { type: String },
  list: [{ type: String }],
  img: { type: String }
});

const SolarLightProduct = mongoose.model('SolarLightProduct', solarLightProductSchema);

export default SolarLightProduct;
