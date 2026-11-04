import express from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamMembersController.js';
import upload from '../middlewares/upload.js';

const router = express.Router({ mergeParams: true });

router.get('/', getTeamMembers);
router.post('/', upload.single('img'), addTeamMember);
router.get('/:memberId', getTeamMemberById);
router.put('/:memberId', upload.single('img'), updateTeamMember);
router.delete('/:memberId', deleteTeamMember);

export default router;
