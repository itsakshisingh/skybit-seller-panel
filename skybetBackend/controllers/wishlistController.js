import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// 1. Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    res.status(200).json({
      count: wishlist.products.length,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId, product } = req.body;
    const targetProductId = productId || product;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const existingProduct = await Product.findById(targetProductId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const isAlreadyInWishlist = wishlist.products.some(
      (id) => id.toString() === targetProductId.toString()
    );

    if (isAlreadyInWishlist) {
      const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
      return res.status(200).json({
        message: 'Product already in wishlist',
        count: populatedWishlist.products.length,
        wishlist: populatedWishlist,
      });
    }

    wishlist.products.push(targetProductId);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      message: 'Product added to wishlist',
      count: populatedWishlist.products.length,
      wishlist: populatedWishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || req.query.userId;
    const targetProductId = req.params.productId || req.body.productId;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== targetProductId.toString()
    );

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      message: 'Product removed from wishlist',
      count: populatedWishlist.products.length,
      wishlist: populatedWishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Toggle product in wishlist (Adds if absent, removes if present)
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId, product } = req.body;
    const targetProductId = productId || product;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const existingProduct = await Product.findById(targetProductId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const index = wishlist.products.findIndex(
      (id) => id.toString() === targetProductId.toString()
    );

    let isAdded = false;
    if (index > -1) {
      wishlist.products.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.products.push(targetProductId);
      isAdded = true;
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
      isAdded,
      count: populatedWishlist.products.length,
      wishlist: populatedWishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      message: 'Wishlist cleared successfully',
      wishlist,
      count: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

