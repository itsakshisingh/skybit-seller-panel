import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      enum: ['led', 'battery', 'pole', 'solar'],
    },
    price: {
      type: Number,
      default: 0,
    },
    // Solar & Electrical Specifications
    wattage: {
      type: String,
      trim: true,
    },
    solarPanelWattage: {
      type: String,
      trim: true,
    },
    voltage: {
      type: String,
      trim: true,
    },
    batteryCapacity: {
      type: String,
      trim: true,
    },
    backupTime: {
      type: String,
      trim: true,
    },
    chargingTime: {
      type: String,
      trim: true,
    },
    efficiency: {
      type: String,
      trim: true,
    },
    // Lighting Specifications
    lumes: {
      type: String,
      trim: true,
    },
    temperature: {
      type: String,
      trim: true,
    },
    ipRating: {
      type: String,
      trim: true,
      default: 'IP65',
    },
    // Physical & Quality Specs
    material: {
      type: String,
      trim: true,
    },
    dimension: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    guaranteeYear: {
      type: String,
      trim: true,
    },
    certification: {
      type: String,
      trim: true,
    },
    application: {
      type: String,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 10,
    },
    description: {
      type: String,
      trim: true,
    },
    list: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
