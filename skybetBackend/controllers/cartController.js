import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to calculate total
const calculateCartTotal = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  if (cart && cart.items) {
    cart.items.forEach((item) => {
      const price = item.price || item.product?.price || 0;
      subtotal += price * item.quantity;
      totalItems += item.quantity;
    });
  }

  return { subtotal, totalItems };
};

// 1. Get current user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const { subtotal, totalItems } = calculateCartTotal(cart);

    res.status(200).json({
      cart,
      subtotal,
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId, product, quantity } = req.body;

    const targetProductId = productId || product;
    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const targetProduct = await Product.findById(targetProductId);
    if (!targetProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const qty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists in cart
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === targetProductId.toString()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
      cart.items[existingIndex].price = targetProduct.price || 0;
    } else {
      cart.items.push({
        product: targetProductId,
        quantity: qty,
        price: targetProduct.price || 0,
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const { subtotal, totalItems } = calculateCartTotal(populatedCart);

    res.status(200).json({
      message: 'Product added to cart successfully',
      cart: populatedCart,
      subtotal,
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId, quantity } = req.body;
    const targetProductId = productId || req.params.productId;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const qty = Number(quantity);
    if (isNaN(qty)) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === targetProductId.toString()
    );

    if (existingIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    if (qty <= 0) {
      // Remove item if quantity becomes 0 or negative
      cart.items.splice(existingIndex, 1);
    } else {
      cart.items[existingIndex].quantity = qty;
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const { subtotal, totalItems } = calculateCartTotal(populatedCart);

    res.status(200).json({
      message: 'Cart updated successfully',
      cart: populatedCart,
      subtotal,
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || req.query.userId;
    const targetProductId = req.params.productId || req.body.productId;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== targetProductId.toString()
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const { subtotal, totalItems } = calculateCartTotal(populatedCart);

    res.status(200).json({
      message: 'Item removed from cart',
      cart: populatedCart,
      subtotal,
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart,
      subtotal: 0,
      totalItems: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

