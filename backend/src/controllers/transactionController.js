import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

const FINE_PER_DAY = Number(process.env.FINE_PER_DAY) || 5;

// Helper to auto-calculate overdue fines & statuses
const updateOverdueStatuses = async () => {
  const now = new Date();
  const overdueTransactions = await Transaction.find({
    status: 'issued',
    dueDate: { $lt: now },
  });

  for (const trans of overdueTransactions) {
    const diffTime = Math.abs(now - new Date(trans.dueDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    trans.status = 'overdue';
    trans.fine = diffDays * FINE_PER_DAY;
    await trans.save();
  }
};

// @desc    Issue a book to a member
// @route   POST /api/transactions/issue
// @access  Private/Admin
export const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, dueDays, notes } = req.body;

    if (!bookId || !memberId) {
      return res.status(400).json({ success: false, message: 'Book ID and Member ID are required' });
    }

    // Verify Book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'All copies of this book are currently borrowed' });
    }

    // Verify Member
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Check if member already has an active issue of this book
    const existingActive = await Transaction.findOne({
      book: bookId,
      member: memberId,
      status: { $in: ['issued', 'overdue'] },
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: 'This member has already borrowed a copy of this book and not yet returned it',
      });
    }

    // Set Due Date (default 14 days or user provided)
    const days = dueDays ? Number(dueDays) : 14;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    // Create transaction
    const transaction = await Transaction.create({
      book: book._id,
      member: member._id,
      issueDate: new Date(),
      dueDate,
      notes: notes || '',
      status: 'issued',
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('book', 'title author isbn coverImage')
      .populate('member', 'name email memberId');

    res.status(201).json({
      success: true,
      data: populated,
      message: `Book "${book.title}" successfully issued to ${member.name}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Return a borrowed book
// @route   POST /api/transactions/return/:id
// @access  Private/Admin
export const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('book')
      .populate('member', 'name email memberId');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ success: false, message: 'This book has already been marked returned' });
    }

    const returnDate = new Date();
    let calculatedFine = 0;

    if (returnDate > new Date(transaction.dueDate)) {
      const diffTime = Math.abs(returnDate - new Date(transaction.dueDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedFine = diffDays * FINE_PER_DAY;
    }

    transaction.returnDate = returnDate;
    transaction.status = 'returned';
    transaction.fine = calculatedFine;
    await transaction.save();

    // Increment book available copies
    const book = await Book.findById(transaction.book._id);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({
      success: true,
      data: transaction,
      message: `Book successfully returned! ${
        calculatedFine > 0 ? `Late fine applicable: $${calculatedFine}` : 'No late fine.'
      }`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get transactions (Admin gets all, Member gets own)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    await updateOverdueStatuses();

    let query = {};
    if (req.user.role !== 'admin') {
      query.member = req.user._id;
    } else if (req.query.memberId) {
      query.member = req.query.memberId;
    }

    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    const transactions = await Transaction.find(query)
      .populate('book', 'title author isbn coverImage shelfLocation')
      .populate('member', 'name email memberId phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics & stats
// @route   GET /api/transactions/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    await updateOverdueStatuses();

    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const totalBooks = await Book.countDocuments();
      const totalCopiesAgg = await Book.aggregate([
        {
          $group: {
            _id: null,
            totalCopies: { $sum: '$totalCopies' },
            availableCopies: { $sum: '$availableCopies' },
          },
        },
      ]);
      const totalMembers = await User.countDocuments({ role: 'member' });
      const activeBorrows = await Transaction.countDocuments({ status: { $in: ['issued', 'overdue'] } });
      const overdueBorrows = await Transaction.countDocuments({ status: 'overdue' });
      const totalFineAgg = await Transaction.aggregate([
        { $match: { fine: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$fine' } } },
      ]);

      const recentTransactions = await Transaction.find()
        .populate('book', 'title author')
        .populate('member', 'name memberId')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        success: true,
        data: {
          totalBooks,
          totalCopies: totalCopiesAgg[0]?.totalCopies || 0,
          availableCopies: totalCopiesAgg[0]?.availableCopies || 0,
          totalMembers,
          activeBorrows,
          overdueBorrows,
          totalFines: totalFineAgg[0]?.total || 0,
          recentTransactions,
        },
      });
    } else {
      // Member specific stats
      const myActiveBorrows = await Transaction.countDocuments({
        member: req.user._id,
        status: { $in: ['issued', 'overdue'] },
      });
      const myOverdue = await Transaction.countDocuments({
        member: req.user._id,
        status: 'overdue',
      });
      const myTotalBorrows = await Transaction.countDocuments({
        member: req.user._id,
      });

      const myFinesAgg = await Transaction.aggregate([
        { $match: { member: req.user._id, fine: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$fine' } } },
      ]);

      const myRecentTransactions = await Transaction.find({ member: req.user._id })
        .populate('book', 'title author coverImage')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        success: true,
        data: {
          myActiveBorrows,
          myOverdue,
          myTotalBorrows,
          myFines: myFinesAgg[0]?.total || 0,
          recentTransactions: myRecentTransactions,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
