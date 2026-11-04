import express from 'express';
import {
  createHomeServe,
  getHomeServes,
  getHomeServeById,
  updateHomeServe,
  deleteHomeServe,
} from '../controllers/homeServeController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createHomeServe);
router.get('/', getHomeServes);
router.get('/:id', getHomeServeById);
router.put('/:id', upload.single('img'), updateHomeServe);
router.delete('/:id', deleteHomeServe);

export default router;
