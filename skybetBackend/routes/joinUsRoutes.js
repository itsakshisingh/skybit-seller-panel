import express from 'express';

import {
  createJoinUs,
  getJoinUs,
  getJoinUsById,
  updateJoinUs,
  deleteJoinUs,
  getHeroJoin,
  createHeroJoin,
  updateHeroJoin,
  deleteHeroJoin,
  getHowWeWork,
  createHowWeWork,
  updateHowWeWork,
  deleteHowWeWork,
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getStats,
  updateStats
} from '../controllers/joinUsController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'heroJoinImg', maxCount: 1 },
  { name: 'howWeWorkImg', maxCount: 1 },
]);


// --- heroJoin routes ---
router.get('/herojoin', getHeroJoin);
router.post('/herojoin', upload.single('img'), createHeroJoin);
router.put('/:id/herojoin', upload.single('img'), updateHeroJoin);
router.delete('/:id/herojoin', deleteHeroJoin);

// --- howWeWork routes ---
router.get('/howwework', getHowWeWork);
router.post('/howwework', upload.single('img'), createHowWeWork);
router.put('/:id/howwework', upload.single('img'), updateHowWeWork);
router.delete('/:id/howwework', deleteHowWeWork);

// --- stats routes ---
router.get('/stats', getStats);
router.put('/:id/stats', updateStats);

// --- teamMembers routes ---
router.get('/teammembers', getTeamMembers);
router.post('/teammembers', upload.single('img'), addTeamMember);
router.get('/teammembers/:memberId', getTeamMemberById);
router.put('/:id/teammembers/:memberId', upload.single('img'), updateTeamMember);
router.delete('/:id/teammembers/:memberId', deleteTeamMember);


router.post('/', uploadFields, createJoinUs);
router.get('/', getJoinUs);


// Dynamic /:id routes
router.get('/:id', getJoinUsById);
router.put('/:id', uploadFields, updateJoinUs);
router.delete('/:id', deleteJoinUs);

export default router;