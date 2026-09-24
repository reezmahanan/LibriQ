import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    accessionNo: {
      type: String,
      trim: true,
      default: '',
    },
    callNumber: {
      type: String,
      trim: true,
      default: '',
    },
    lendingType: {
      type: String,
      enum: ['Lending', 'Scheduled Reference (SR)', 'Permanent Reference (PR)', 'Past Paper'],
      default: 'Lending',
    },
    language: {
      type: String,
      enum: ['English', 'Sinhala', 'Tamil', 'Multilingual'],
      default: 'English',
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies count is required'],
      min: [1, 'Total copies must be at least 1'],
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'Available copies cannot be negative'],
    },
    shelfLocation: {
      type: String,
      default: 'Main Library - Floor 1',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    publishedYear: {
      type: Number,
    },
    publisher: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexing
bookSchema.index(
  {
    title: 'text',
    author: 'text',
    category: 'text',
    isbn: 'text',
    accessionNo: 'text',
    callNumber: 'text',
  },
  {
    language_override: 'searchLanguage',
  }
);

export default mongoose.model('Book', bookSchema);
