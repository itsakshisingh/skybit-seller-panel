import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', upload.single('img'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
