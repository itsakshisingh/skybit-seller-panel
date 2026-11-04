import express from 'express';
import upload from '../middlewares/upload.js';
import {
  createSolarPanelProduct,
  getAllSolarPanelProducts,
  getSolarPanelProductById,
  updateSolarPanelProduct,
  deleteSolarPanelProduct
} from '../controllers/solarPanelProductController.js';

const router = express.Router();

router.post('/', upload.single('img'), createSolarPanelProduct);
router.get('/', getAllSolarPanelProducts);
router.get('/:id', getSolarPanelProductById);
router.put('/:id', upload.single('img'), updateSolarPanelProduct);
router.delete('/:id', deleteSolarPanelProduct);

export default router;
