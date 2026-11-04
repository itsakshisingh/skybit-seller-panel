import express from 'express';
import {
  getHowWeWork,
  updateHowWeWork,
  getStats,
  updateStats,
} from '../controllers/howWeWorkController.js';
import upload from '../middlewares/upload.js';

const router = express.Router({ mergeParams: true });

router.get('/', getHowWeWork);
router.put('/', upload.single('img'), updateHowWeWork);
router.get('/stats', getStats);
router.put('/stats', updateStats);

export default router;
