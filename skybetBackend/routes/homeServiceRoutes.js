import express from 'express';
import {
  createHomeService,
  getHomeServices,
  getHomeServiceById,
  updateHomeService,
  deleteHomeService,
} from '../controllers/homeServiceController.js';

const router = express.Router();

router.post('/', createHomeService);
router.get('/', getHomeServices);
router.get('/:id', getHomeServiceById);
router.put('/:id', updateHomeService);
router.delete('/:id', deleteHomeService);

export default router;
