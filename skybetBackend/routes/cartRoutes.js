import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { optionalAuth, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET cart for current user (via Bearer token or ?userId=...)
router.get('/', optionalAuth, getCart);

// POST add item to cart (via Bearer token or body { userId, productId, quantity })
router.post('/add', optionalAuth, addToCart);
router.post('/', optionalAuth, addToCart);

// PUT update quantity of an item
router.put('/update', optionalAuth, updateCartItem);
router.put('/update/:productId', optionalAuth, updateCartItem);

// DELETE remove item from cart
router.delete('/remove/:productId', optionalAuth, removeFromCart);
router.delete('/item/:productId', optionalAuth, removeFromCart);

// DELETE clear all items from cart
router.delete('/clear', optionalAuth, clearCart);

export default router;

