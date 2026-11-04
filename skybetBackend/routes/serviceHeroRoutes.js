import express from 'express';
import {
  createServiceHero,
  getServiceHeros,
  getServiceHeroById,
  updateServiceHero,
  deleteServiceHero,
} from '../controllers/serviceHeroController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createServiceHero);
router.get('/', getServiceHeros);
router.get('/:id', getServiceHeroById);
router.put('/:id', upload.single('img'), updateServiceHero);
router.delete('/:id', deleteServiceHero);

export default router;
