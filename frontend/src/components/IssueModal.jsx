import React, { useState, useEffect } from 'react';
import { X, SendHorizontal, Loader2, Book, User, Calendar, FileText } from 'lucide-react';
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
      setError('Failed to load books and patrons list');
    } finally {
      setFetching(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) {
      setError('Please select both a book and a patron');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A5F]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-[#1F2937]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F7F9FC]">
          <div className="flex items-center gap-2.5 font-black text-[#1E3A5F] text-lg">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-[#F4B942] flex items-center justify-center">
              <Book className="w-4 h-4" />
            </div>
            <div>
              <span>Issue Book / Circulation</span>
              <span className="block text-[11px] font-medium text-slate-500">நூல் இரவல் வழங்கல் • පොත් නිකුත් කිරීම</span>
            </div>
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
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          {fetching ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#1E3A5F]" />
              <span className="text-xs font-semibold">Loading available stack titles & student roster...</span>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                  <Book className="w-3.5 h-3.5 text-[#2E6F95]" />
                  <span>Select Book / புத்தகம் (In Library Stack)</span>
                </label>
                <select
                  required
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition bg-white"
                >
                  {books.length === 0 ? (
                    <option value="">No titles currently in shelf stack</option>
                  ) : (
                    books.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title} [{b.accessionNo || 'ACC'}] — {b.availableCopies} available
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-[#2E6F95]" />
                  <span>Student or Staff Patron / மாணவர்</span>
                </label>
                <select
                  required
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition bg-white"
                >
                  {members.length === 0 ? (
                    <option value="">No registered patrons</option>
                  ) : (
                    members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.indexNo || m.memberId}) — {m.activeBorrowsCount || 0} active loans
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#2E6F95]" />
                  <span>Loan Period / தவணைக் காலம் (Due in Days)</span>
                </label>
                <select
                  value={dueDays}
                  onChange={(e) => setDueDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition bg-white"
                >
                  <option value={7}>7 Days (SR / Scheduled Reference Loan)</option>
                  <option value={14}>14 Days (Standard Undergraduate Loan)</option>
                  <option value={21}>21 Days (Extended Study Loan)</option>
                  <option value={28}>28 Days (Academic Staff / Final Year Project)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-[#2E6F95]" />
                  <span>Circulation Notes (Optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Verified student index card 23IT0480, good condition"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
                />
              </div>
            </>
          )}

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
              disabled={loading || fetching || books.length === 0}
              className="flex items-center gap-2 px-5 py-2 text-sm font-black text-white bg-[#1E3A5F] hover:bg-[#2E6F95] rounded-xl shadow-md transition disabled:opacity-50 border border-[#2E6F95]/30"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin text-[#F4B942]" />}
              <span>Confirm Circulation Issue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
