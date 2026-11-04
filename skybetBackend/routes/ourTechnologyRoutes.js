import express from 'express';
import multer from 'multer';
import {
  getHeroSection,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  getTechItems,
  addTechItem,
  updateTechItem,
  deleteTechItem
} from '../controllers/ourTechnologyController.js';

const router = express.Router();

import upload from '../middlewares/upload.js';

// HeroSection routes
router.get('/herosection', getHeroSection);
router.post('/herosection', upload.single('img'), createHeroSection);
router.put('/herosection', upload.single('img'), updateHeroSection);
router.delete('/herosection', deleteHeroSection);

// TechItems routes
router.get('/techitems', getTechItems);
router.post('/techitems', upload.single('img'), addTechItem);
router.put('/techitems/:itemId', upload.single('img'), updateTechItem);
router.delete('/techitems/:itemId', deleteTechItem);

export default router;
