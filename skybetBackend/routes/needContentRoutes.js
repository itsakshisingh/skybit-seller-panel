import express from 'express';
import {
  createNeedContent,
  getNeedContents,
  getNeedContentById,
  updateNeedContent,
  deleteNeedContent,
  getNeedContentsByCategory,
} from '../controllers/needContentController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createNeedContent);
router.get('/', getNeedContents);

// Category-wise GET endpoints using controller
router.get('/category/:category', getNeedContentsByCategory);
router.get('/:id', getNeedContentById);
router.put('/:id', upload.single('img'), updateNeedContent);
router.delete('/:id', deleteNeedContent);

export default router;
