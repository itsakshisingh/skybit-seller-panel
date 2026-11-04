import express from 'express';
import upload from '../middlewares/upload.js';
import {
  getHeroSection,
  createOrUpdateHeroSection,
  getWeOffer,
  addWeOffer,
  updateWeOffer,
  deleteWeOffer,
  getAdditionalSection,
  createOrUpdateAdditionalSection
} from '../controllers/jobPageController.js';

const router = express.Router();

// Hero Section
router.get('/herosection', getHeroSection);
router.post('/herosection', upload.single('img'), createOrUpdateHeroSection);

// WeOffer
router.get('/weoffer', getWeOffer);
router.post('/weoffer', addWeOffer);
router.put('/weoffer/:itemId', updateWeOffer);
router.delete('/weoffer/:itemId', deleteWeOffer);

// Additional Section
router.get('/additionalsection', getAdditionalSection);
router.post('/additionalsection', upload.single('img'), createOrUpdateAdditionalSection);

export default router;
