import express from 'express';
import { getHeroJoin, updateHeroJoin } from '../controllers/heroJoinController.js';
import upload from '../middlewares/upload.js';

const router = express.Router({ mergeParams: true });

router.get('/', getHeroJoin);
router.put('/', upload.single('img'), updateHeroJoin);

export default router;
