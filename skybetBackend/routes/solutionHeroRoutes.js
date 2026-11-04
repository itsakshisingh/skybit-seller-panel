import express from 'express';
import upload from '../middlewares/upload.js';
import {
  createSolutionHero,
  getAllSolutionHeroes,
  getSolutionHeroById,
  updateSolutionHero,
  deleteSolutionHero,
  getSolutionHeroesByCategory
} from '../controllers/solutionHeroController.js';

const router = express.Router();


// Create
router.post('/', upload.single('img'), createSolutionHero);
// Get all
router.get('/', getAllSolutionHeroes);
// Get by category
router.get('/category/:category', getSolutionHeroesByCategory);
// Get by ID
router.get('/:id', getSolutionHeroById);
// Update
router.put('/:id', upload.single('img'), updateSolutionHero);
// Delete
router.delete('/:id', deleteSolutionHero);

export default router;
