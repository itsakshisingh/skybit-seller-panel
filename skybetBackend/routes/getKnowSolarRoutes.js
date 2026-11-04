import express from 'express';
import upload from '../middlewares/upload.js';
import {
  getGetKnowSolar,
  upsertGetKnowSolar,
  // Hero Section
  getHeroSection,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  // Foundation
  getFoundation,
  createFoundation,
  updateFoundation,
  deleteFoundation,
  // ChooseSolar
  getChooseSolar,
  addChooseSolar,
  updateChooseSolar,
  deleteChooseSolar,
  // WhereSolarFits
  getWhereSolarFits,
  createWhereSolarFits,
  updateWhereSolarFits,
  deleteWhereSolarFits
} from '../controllers/getKnowSolarController.js';

const router = express.Router();

// Whole Document
router.get('/', getGetKnowSolar);
router.post('/', upsertGetKnowSolar);

// Hero Section
router.get('/hero', getHeroSection);
router.post('/hero', upload.single('img'), createHeroSection);
router.put('/hero', upload.single('img'), updateHeroSection);
router.delete('/hero', deleteHeroSection);

// Foundation Section (Array)
router.get('/foundation', getFoundation);
router.post('/foundation', createFoundation);
router.put('/foundation/:itemId', updateFoundation);
router.delete('/foundation/:itemId', deleteFoundation);

// ChooseSolar (Array)
router.get('/choose-solar', getChooseSolar);
router.post('/choose-solar', upload.single('img'), addChooseSolar);
router.put('/choose-solar/:itemId', upload.single('img'), updateChooseSolar);
router.delete('/choose-solar/:itemId', deleteChooseSolar);

// WhereSolarFits (Single)
router.get('/where-solar-fits', getWhereSolarFits);
router.post('/where-solar-fits', upload.single('img'), createWhereSolarFits);
router.put('/where-solar-fits', upload.single('img'), updateWhereSolarFits);
router.delete('/where-solar-fits', deleteWhereSolarFits);

export default router;
