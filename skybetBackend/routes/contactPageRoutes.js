import express from 'express';
import upload from '../middlewares/upload.js';
import {
  upsertContactPage,
  getContactPage,
  updateHeroSection,
  getHeroSection,
  createHeroSection,
  deleteHeroSection,
  updateAddress,
  getAddress,
  createAddress,
  deleteAddress,
  addInfoSection,
  updateInfoSection,
  deleteInfoSection,
  getInfoSections,
  getInfoSectionById
} from '../controllers/contactPageController.js';

const router = express.Router();


// Whole ContactPage
router.get('/', getContactPage);
router.post('/', upsertContactPage);

// Hero Section CRUD
router.get('/hero', getHeroSection);
router.post('/hero', upload.single('img'), createHeroSection);
router.put('/hero', upload.single('img'), updateHeroSection);
router.delete('/hero', deleteHeroSection);

// Address Section CRUD
router.get('/address', getAddress);
router.post('/address', createAddress);
router.put('/address', updateAddress);
router.delete('/address', deleteAddress);

// Info Sections CRUD
router.get('/info-sections', getInfoSections);
router.get('/info-sections/:sectionId', getInfoSectionById);
router.post('/info-sections', upload.array('images', 10), addInfoSection);
router.put('/info-sections/:sectionId', upload.array('images', 10), updateInfoSection);
router.delete('/info-sections/:sectionId', deleteInfoSection);

export default router;
