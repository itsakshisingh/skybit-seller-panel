import express from 'express';
import {
  createRegionalProduct,
  getRegionalProducts,
  getRegionalProductById,
  updateRegionalProduct,
  deleteRegionalProduct,
} from '../controllers/regionalProductController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createRegionalProduct);
router.get('/', getRegionalProducts);
router.get('/:id', getRegionalProductById);
router.put('/:id', upload.single('img'), updateRegionalProduct);
router.delete('/:id', deleteRegionalProduct);

export default router;
