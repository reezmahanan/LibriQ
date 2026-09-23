import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  SendHorizontal,
  BookOpen,
  MapPin,
  Layers,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../api/client';

export default function Books({ onOpenAddBook, onOpenEditBook, onIssueBook }) {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, [selectedCategory, availabilityFilter]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/books/categories');
      if (res.data?.success) {
        setCategories(['All', ...res.data.data]);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let params = {};
      if (search) params.search = search;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (availabilityFilter !== 'all') params.availability = availabilityFilter;

      const res = await api.get('/books', { params });
      if (res.data?.success) {
        setBooks(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}" from catalog?`)) {
      return;
    }

    setDeleteLoading(book._id);
    setFeedback(null);
    try {
      const res = await api.delete(`/books/${book._id}`);
      setFeedback({ type: 'success', text: res.data?.message || 'Book removed' });
      fetchBooks();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete book',
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Book Catalog</h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? 'Manage library inventory, update shelf locations, and issue books.'
              : 'Browse all physical titles available in the library collection.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAddBook}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-sm font-medium flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold uppercase hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              Search
            </button>
          </form>

          {/* Availability filter */}
          <div className="flex items-center gap-2">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-700"
            >
              <option value="all">All Copies</option>
              <option value="available">In Stock Only</option>
              <option value="borrowed_out">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading catalog collection...</span>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No books found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const isAvailable = book.availableCopies > 0;

            return (
              <div
                key={book._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Cover / Header */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                        <BookOpen className="w-10 h-10 mb-1" />
                        <span className="text-xs font-semibold uppercase tracking-wider">No Cover</span>
                      </div>
                    )}

                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-slate-800 shadow-xs">
                        {book.category}
                      </span>
                    </div>

                    {/* Stock badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            {book.availableCopies} Left
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Borrowed
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        By <span className="text-slate-700">{book.author}</span>
                      </p>
                    </div>

                    {book.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{book.shelfLocation || 'Main Hall'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>{book.totalCopies} Total Copies</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      ISBN: {book.isbn}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => onIssueBook(book._id)}
                        disabled={!isAvailable}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                      >
                        <SendHorizontal className="w-3.5 h-3.5" />
                        <span>Issue Copy</span>
                      </button>

                      <button
                        onClick={() => onOpenEditBook(book)}
                        className="p-2 text-slate-600 hover:bg-white hover:text-blue-600 rounded-lg border border-transparent hover:border-slate-200 transition"
                        title="Edit book details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(book)}
                        disabled={deleteLoading === book._id}
                        className="p-2 text-slate-400 hover:bg-white hover:text-rose-600 rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-50"
                        title="Delete from catalog"
                      >
                        {deleteLoading === book._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs font-semibold">
                      <span className={isAvailable ? 'text-emerald-700' : 'text-slate-400'}>
                        {isAvailable ? '✓ Available to Borrow' : 'Currently Borrowed'}
                      </span>
                      <span className="text-slate-400 font-normal">
                        Loc: {book.shelfLocation || 'Shelf'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
