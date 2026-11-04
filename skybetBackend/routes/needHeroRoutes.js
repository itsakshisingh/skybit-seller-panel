import express from 'express';
import {
  createNeedHero,
  getNeedHeros,
  getNeedHeroById,
  updateNeedHero,
  deleteNeedHero,
} from '../controllers/needHeroController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createNeedHero);
router.get('/', getNeedHeros);
router.get('/:id', getNeedHeroById);
router.put('/:id', upload.single('img'), updateNeedHero);
router.delete('/:id', deleteNeedHero);

export default router;
