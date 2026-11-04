import express from 'express';
import {
  createHomeHead,
  getHomeHeads,
  getHomeHeadById,
  updateHomeHead,
  deleteHomeHead,
} from '../controllers/homeHeadController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createHomeHead);
router.get('/', getHomeHeads);
router.get('/:id', getHomeHeadById);
router.put('/:id', upload.single('img'), updateHomeHead);
router.delete('/:id', deleteHomeHead);

export default router;
