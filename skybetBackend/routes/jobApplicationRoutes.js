import express from 'express';
import {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  updateJobApplication,
  deleteJobApplication
} from '../controllers/jobApplicationController.js';

const router = express.Router();

router.post('/', createJobApplication);
router.get('/', getAllJobApplications);
router.get('/:id', getJobApplicationById);
router.put('/:id', updateJobApplication);
router.delete('/:id', deleteJobApplication);

export default router;
