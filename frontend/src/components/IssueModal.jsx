import React, { useState, useEffect } from 'react';
import { X, SendHorizontal, Loader2, BookOpen, User } from 'lucide-react';
import api from '../api/client';

export default function IssueModal({ isOpen, onClose, onIssued, preselectedBookId }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [dueDays, setDueDays] = useState(14);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedBookId) {
      setSelectedBook(preselectedBookId);
    }
  }, [preselectedBookId, isOpen]);

  const loadData = async () => {
    setFetching(true);
    try {
      const [booksRes, membersRes] = await Promise.all([
        api.get('/books?availability=available'),
        api.get('/users/members'),
      ]);
      setBooks(booksRes.data.data || []);
      setMembers(membersRes.data.data || []);

      if (!preselectedBookId && booksRes.data.data?.length > 0) {
        setSelectedBook(booksRes.data.data[0]._id);
      }
      if (membersRes.data.data?.length > 0) {
        setSelectedMember(membersRes.data.data[0]._id);
      }
    } catch (err) {
      setError('Failed to load books and members list');
    } finally {
      setFetching(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) {
      setError('Please select both a book and a member');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/transactions/issue', {
        bookId: selectedBook,
        memberId: selectedMember,
        dueDays: Number(dueDays),
        notes,
      });
      onIssued();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-lg">
            <SendHorizontal className="w-5 h-5 text-blue-600" />
            <span>Issue Book to Member</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          {fetching ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-sm">Loading available books & members...</span>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Book (Available Copies Only)</span>
                </label>
                <select
                  required
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                >
                  {books.length === 0 ? (
                    <option value="">No books currently available for issue</option>
                  ) : (
                    books.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title} ({b.availableCopies} available) - {b.author}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Registered Member</span>
                </label>
                <select
                  required
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                >
                  {members.length === 0 ? (
                    <option value="">No registered members found</option>
                  ) : (
                    members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.memberId || m.email}) - {m.activeBorrowsCount || 0} active borrow(s)
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Issue Period / Loan Duration
                </label>
                <select
                  value={dueDays}
                  onChange={(e) => setDueDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                >
                  <option value={7}>7 Days (1 Week loan)</option>
                  <option value={14}>14 Days (Standard 2 Weeks loan)</option>
                  <option value={21}>21 Days (3 Weeks loan)</option>
                  <option value={30}>30 Days (1 Month loan)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Staff Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Verified student badge, good condition"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetching || books.length === 0}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Confirm Issue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
