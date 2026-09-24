import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all members with borrow counts
// @route   GET /api/users/members
// @access  Private/Admin
export const getMembers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'member' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { memberId: { $regex: search, $options: 'i' } },
        { indexNo: { $regex: search, $options: 'i' } },
        { nic: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Attach active borrow counts to each member
    const membersWithStats = await Promise.all(
      members.map(async (m) => {
        const activeCount = await Transaction.countDocuments({
          member: m._id,
          status: { $in: ['issued', 'overdue'] },
        });
        return {
          ...m.toObject(),
          activeBorrowsCount: activeCount,
        };
      })
    );

    res.json({ success: true, count: members.length, data: membersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member profile and history
// @route   GET /api/users/members/:id
// @access  Private
export const getMemberById = async (req, res) => {
  try {
    // Ensure member can only view themselves unless admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
    }

    const member = await User.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const transactions = await Transaction.find({ member: member._id })
      .populate('book', 'title author isbn coverImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { ...member.toObject(), transactions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
