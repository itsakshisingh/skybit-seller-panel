import Product from '../models/Product.js';

// Create product with solar specifications
export const createProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    wattage,
    solarPanelWattage,
    voltage,
    batteryCapacity,
    backupTime,
    chargingTime,
    efficiency,
    lumes,
    temperature,
    ipRating,
    material,
    dimension,
    weight,
    guaranteeYear,
    certification,
    application,
    inStock,
    stockQuantity,
    description,
    list,
  } = req.body;

  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !img || !category) {
    return res.status(400).json({ message: 'Name, image and category are required' });
  }

  try {
    const parsedList = Array.isArray(list)
      ? list
      : typeof list === 'string'
      ? (() => {
          try {
            return JSON.parse(list);
          } catch {
            return list.split(',').map((s) => s.trim()).filter(Boolean);
          }
        })()
      : [];

    const product = await Product.create({
      name,
      img,
      category,
      price: price ? Number(price) : 0,
      wattage,
      solarPanelWattage,
      voltage,
      batteryCapacity,
      backupTime,
      chargingTime,
      efficiency,
      lumes,
      temperature,
      ipRating: ipRating || 'IP65',
      material,
      dimension,
      weight,
      guaranteeYear,
      certification,
      application,
      inStock: inStock === 'false' || inStock === false ? false : true,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 10,
      description,
      list: parsedList,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { category, inStock } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID (Detailed solar specification sheet)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      wattage,
      solarPanelWattage,
      voltage,
      batteryCapacity,
      backupTime,
      chargingTime,
      efficiency,
      lumes,
      temperature,
      ipRating,
      material,
      dimension,
      weight,
      guaranteeYear,
      certification,
      application,
      inStock,
      stockQuantity,
      description,
      list,
    } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(category && { category }),
      ...(price !== undefined && { price: Number(price) }),
      ...(wattage !== undefined && { wattage }),
      ...(solarPanelWattage !== undefined && { solarPanelWattage }),
      ...(voltage !== undefined && { voltage }),
      ...(batteryCapacity !== undefined && { batteryCapacity }),
      ...(backupTime !== undefined && { backupTime }),
      ...(chargingTime !== undefined && { chargingTime }),
      ...(efficiency !== undefined && { efficiency }),
      ...(lumes !== undefined && { lumes }),
      ...(temperature !== undefined && { temperature }),
      ...(ipRating !== undefined && { ipRating }),
      ...(material !== undefined && { material }),
      ...(dimension !== undefined && { dimension }),
      ...(weight !== undefined && { weight }),
      ...(guaranteeYear !== undefined && { guaranteeYear }),
      ...(certification !== undefined && { certification }),
      ...(application !== undefined && { application }),
      ...(inStock !== undefined && { inStock: inStock === 'true' || inStock === true }),
      ...(stockQuantity !== undefined && { stockQuantity: Number(stockQuantity) }),
      ...(description !== undefined && { description }),
    };

    if (list) {
      updateData.list = Array.isArray(list)
        ? list
        : typeof list === 'string'
        ? (() => {
            try {
              return JSON.parse(list);
            } catch {
              return list.split(',').map((s) => s.trim()).filter(Boolean);
            }
          })()
        : [];
    }

    if (req.file) {
      updateData.img = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
