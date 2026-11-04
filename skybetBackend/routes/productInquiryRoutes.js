import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  getMyInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/productInquiryController.js';
import { protect, adminOnly, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. Submit product inquiry (User submits inquiry on a product)
router.post('/', optionalAuth, createInquiry);
router.post('/create', optionalAuth, createInquiry);

// 2. User gets their own inquiries
// Option A: With Bearer token
router.get('/my-inquiries', protect, getMyInquiries);
router.get('/my', protect, getMyInquiries);
// Option B: Query or URL param by userId (e.g., /user/64f...)
router.get('/user/:userId', getMyInquiries);

// 3. Admin gets all inquiries
router.get('/admin/all', protect, adminOnly, getAllInquiries);
router.get('/all', protect, adminOnly, getAllInquiries);

// 4. Root GET route:
// - If Admin: returns all inquiries
// - If User: returns user's own inquiries
router.get('/', protect, (req, res, next) => {
  if (req.user.role === 'admin') {
    return getAllInquiries(req, res, next);
  }
  return getMyInquiries(req, res, next);
});

// 5. Get single inquiry by ID
router.get('/:id', protect, getInquiryById);

// 6. Update inquiry status (Admin only)
router.put('/:id/status', protect, adminOnly, updateInquiryStatus);

// 7. Delete inquiry (Admin only)
router.delete('/:id', protect, adminOnly, deleteInquiry);

export default router;

