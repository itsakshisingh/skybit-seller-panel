import express from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getUsers,
  getUserById,
  deleteUser,
} from '../controllers/authController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post('/refresh', refreshAccessToken);
router.post('/logout', optionalAuth, logout);

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;
