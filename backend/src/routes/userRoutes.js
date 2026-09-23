import express from 'express';
import { getMembers, getMemberById } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/members', protect, adminOnly, getMembers);
router.get('/members/:id', protect, getMemberById);

export default router;
