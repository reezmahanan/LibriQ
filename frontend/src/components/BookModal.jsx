import React, { useState, useEffect } from 'react';
import { X, BookPlus, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function BookModal({ isOpen, onClose, onSave, bookToEdit, categories }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science & IT',
    accessionNo: '',
    callNumber: '',
    lendingType: 'Lending',
    language: 'English',
    totalCopies: 5,
    shelfLocation: 'Stack Area 1 - Main Floor',
    coverImage: '',
    description: '',
    publishedYear: 2024,
    publisher: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        isbn: bookToEdit.isbn || '',
        category: bookToEdit.category || 'Computer Science & IT',
        accessionNo: bookToEdit.accessionNo || '',
        callNumber: bookToEdit.callNumber || '',
        lendingType: bookToEdit.lendingType || 'Lending',
        language: bookToEdit.language || 'English',
        totalCopies: bookToEdit.totalCopies || 1,
        shelfLocation: bookToEdit.shelfLocation || 'Stack Area 1 - Main Floor',
        coverImage: bookToEdit.coverImage || '',
        description: bookToEdit.description || '',
        publishedYear: bookToEdit.publishedYear || 2024,
        publisher: bookToEdit.publisher || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: 'Computer Science & IT',
        accessionNo: '',
        callNumber: '',
        lendingType: 'Lending',
        language: 'English',
        totalCopies: 5,
        shelfLocation: 'Stack Area 1 - Main Floor',
        coverImage: '',
        description: '',
        publishedYear: new Date().getFullYear(),
        publisher: '',
      });
    }
    setError('');
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (bookToEdit) {
        await api.put(`/books/${bookToEdit._id}`, formData);
      } else {
        await api.post('/books', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A5F]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-[#1F2937]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F7F9FC]">
          <div className="flex items-center gap-2.5 font-black text-[#1E3A5F] text-lg">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-[#F4B942] flex items-center justify-center">
              <BookPlus className="w-4 h-4" />
            </div>
            <span>{bookToEdit ? 'Edit Accession Details' : 'Add New Library Accession'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Book Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Database System Concepts"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Author(s) *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Abraham Silberschatz"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">ISBN Number *</label>
              <input
                type="text"
                required
                disabled={!!bookToEdit}
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="e.g. 978-0073523323"
                className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition ${
                  bookToEdit ? 'bg-slate-100 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                Accession Number (Barcoded)
              </label>
              <input
                type="text"
                value={formData.accessionNo}
                onChange={(e) => setFormData({ ...formData, accessionNo: e.target.value })}
                placeholder="e.g. ACC-2024-0480 (auto if empty)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                Dewey Decimal Call No (DDC)
              </label>
              <input
                type="text"
                value={formData.callNumber}
                onChange={(e) => setFormData({ ...formData, callNumber: e.target.value })}
                placeholder="e.g. 005.74 SIL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                Lending Classification
              </label>
              <select
                value={formData.lendingType}
                onChange={(e) => setFormData({ ...formData, lendingType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition bg-white"
              >
                <option value="Lending">Lending (සාමාන්‍ය ණයට දීම)</option>
                <option value="Scheduled Reference (SR)">Scheduled Reference - SR (විමර්ශන)</option>
                <option value="Permanent Reference (PR)">Permanent Reference - PR (ස්ථිර විමර්ශන)</option>
                <option value="Past Paper">Past Exam Paper Repository</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition bg-white"
              >
                <option value="English">English</option>
                <option value="Sinhala">Sinhala (සිංහල)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Multilingual">Multilingual</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Category / Discipline *</label>
              <input
                type="text"
                list="category-suggestions"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Computer Science & IT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
              <datalist id="category-suggestions">
                {categories && categories.map((cat) => <option key={cat} value={cat} />)}
                <option value="Computer Science & IT" />
                <option value="Engineering & Technology" />
                <option value="Sri Lankan Studies & Heritage" />
                <option value="Sinhala Literature" />
                <option value="Tamil Literature" />
                <option value="Past Exam Papers & Repositories" />
                <option value="Management & Commerce" />
                <option value="Applied Sciences" />
              </datalist>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Total Copies In Library *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Stack / Shelf Location</label>
              <input
                type="text"
                value={formData.shelfLocation}
                onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                placeholder="e.g. Stack Area 2 - Shelf IT-04"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="e.g. Pearson / Sarasa Colombo / UGC"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Cover Image URL (Optional)</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Annotation / Course Syllabus Context</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Recommended module reference, edition notes, syllabus links..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-black text-white bg-[#1E3A5F] hover:bg-[#2E6F95] rounded-xl shadow-md transition disabled:opacity-50 border border-[#2E6F95]/30"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin text-[#F4B942]" />}
              <span>{bookToEdit ? 'Save Accession' : 'Register Accession'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
