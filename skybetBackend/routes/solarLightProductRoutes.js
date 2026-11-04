import express from 'express';
import upload from '../middlewares/upload.js';
import {
  createSolarLightProduct,
  getAllSolarLightProducts,
  getSolarLightProductById,
  updateSolarLightProduct,
  deleteSolarLightProduct
} from '../controllers/solarLightProductController.js';

const router = express.Router();

router.post('/', upload.single('img'), createSolarLightProduct);
router.get('/', getAllSolarLightProducts);
router.get('/:id', getSolarLightProductById);
router.put('/:id', upload.single('img'), updateSolarLightProduct);
router.delete('/:id', deleteSolarLightProduct);

export default router;
