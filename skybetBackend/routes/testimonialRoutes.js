import express from 'express';
import {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('img'), createTestimonial);
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);
router.put('/:id', upload.single('img'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
