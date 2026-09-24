import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all books with search, filter, and pagination
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const { search, category, availability, lendingType, language, sort } = req.query;

    let query = {};

    // Search by title, author, ISBN, Accession No, or Call No
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
        { accessionNo: { $regex: search, $options: 'i' } },
        { callNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Lending type filter (Lending, SR, PR, Past Paper)
    if (lendingType && lendingType !== 'All') {
      query.lendingType = lendingType;
    }

    // Language filter
    if (language && language !== 'All') {
      query.language = language;
    }

    // Availability filter
    if (availability === 'available') {
      query.availableCopies = { $gt: 0 };
    } else if (availability === 'borrowed_out') {
      query.availableCopies = 0;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'title_asc') sortOptions = { title: 1 };
    if (sort === 'title_desc') sortOptions = { title: -1 };
    if (sort === 'author_asc') sortOptions = { author: 1 };

    const books = await Book.find(query).sort(sortOptions);
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book details
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      accessionNo,
      callNumber,
      lendingType,
      language,
      totalCopies,
      shelfLocation,
      coverImage,
      description,
      publishedYear,
      publisher,
    } = req.body;

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    // Auto-generate accessionNo if not provided
    const bookCount = await Book.countDocuments();
    const generatedAccession = accessionNo?.trim() || `ACC-${new Date().getFullYear()}-${String(bookCount + 101).padStart(4, '0')}`;

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      accessionNo: generatedAccession,
      callNumber: callNumber || '000 GEN',
      lendingType: lendingType || 'Lending',
      language: language || 'English',
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies),
      shelfLocation: shelfLocation || 'Main Library - Floor 1',
      coverImage: coverImage || '',
      description: description || '',
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
      publisher: publisher || '',
    });

    res.status(201).json({ success: true, data: book, message: 'Book added to catalog successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const { totalCopies } = req.body;
    if (totalCopies !== undefined) {
      const difference = Number(totalCopies) - book.totalCopies;
      const newAvailable = book.availableCopies + difference;
      if (newAvailable < 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot decrease total copies below currently issued count (${book.totalCopies - book.availableCopies} currently issued)`,
        });
      }
      req.body.availableCopies = newAvailable;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedBook, message: 'Book updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if currently issued
    const activeBorrows = await Transaction.countDocuments({
      book: req.params.id,
      status: { $in: ['issued', 'overdue'] },
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete book: ${activeBorrows} copies are currently issued to patrons`,
      });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Book removed from library catalog' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all unique book categories
// @route   GET /api/books/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
