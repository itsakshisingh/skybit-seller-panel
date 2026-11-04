import express from 'express';
import {
  createCompanyGallery,
  getCompanyGallery,
  getCompanyGalleryById,
  updateCompanyGallery,
  deleteCompanyGallery,
} from '../controllers/companyGalleryController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createCompanyGallery);
router.get('/', getCompanyGallery);
router.get('/:id', getCompanyGalleryById);
router.put('/:id', upload.single('img'), updateCompanyGallery);
router.delete('/:id', deleteCompanyGallery);

export default router;
