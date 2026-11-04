import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { optionalAuth, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET user's wishlist
router.get('/', optionalAuth, getWishlist);

// POST add product to wishlist
router.post('/add', optionalAuth, addToWishlist);
router.post('/', optionalAuth, addToWishlist);

// POST toggle product in wishlist (adds if not present, removes if present)
router.post('/toggle', optionalAuth, toggleWishlist);

// DELETE remove product from wishlist
router.delete('/remove/:productId', optionalAuth, removeFromWishlist);
router.delete('/item/:productId', optionalAuth, removeFromWishlist);

// DELETE clear wishlist
router.delete('/clear', optionalAuth, clearWishlist);

export default router;

