import express from 'express';
import {
  issueBook,
  returnBook,
  getTransactions,
  getDashboardStats,
} from '../controllers/transactionController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/', protect, getTransactions);

// Admin-only transaction actions
router.post('/issue', protect, adminOnly, issueBook);
router.post('/return/:id', protect, adminOnly, returnBook);

export default router;
