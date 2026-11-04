import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} from '../controllers/productBookingController.js';
import { protect, adminOnly, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. Submit product booking (User books product with address)
router.post('/', optionalAuth, createBooking);
router.post('/create', optionalAuth, createBooking);

// 2. User gets their own booked products & status
// Option A: With Bearer token
router.get('/my-bookings', protect, getMyBookings);
router.get('/my', protect, getMyBookings);
// Option B: Query or URL param by userId (e.g., /user/64f...)
router.get('/user/:userId', getMyBookings);

// 3. Admin gets all bookings and statuses
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.get('/all', protect, adminOnly, getAllBookings);

// 4. Root GET route:
// - If Admin token: returns all bookings
// - If User token: returns only that user's bookings
router.get('/', protect, (req, res, next) => {
  if (req.user.role === 'admin') {
    return getAllBookings(req, res, next);
  }
  return getMyBookings(req, res, next);
});

// 5. Get single booking details
router.get('/:id', protect, getBookingById);

// 6. Update booking status (Admin only)
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

// 7. Cancel booking (User or Admin)
router.put('/:id/cancel', protect, cancelBooking);

// 8. Delete booking (Admin only)
router.delete('/:id', protect, adminOnly, deleteBooking);

export default router;

