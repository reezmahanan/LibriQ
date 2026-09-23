import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Filter,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../api/client';

export default function Transactions({ onOpenIssueModal }) {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [returnLoading, setReturnLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const res = await api.get('/transactions', { params });
      if (res.data?.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (transId) => {
    if (!window.confirm('Process return for this book?')) return;

    setReturnLoading(transId);
    setFeedback(null);
    try {
      const res = await api.post(`/transactions/return/${transId}`);
      setFeedback({
        type: 'success',
        text: res.data?.message || 'Book returned successfully!',
      });
      fetchTransactions();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to process return',
      });
    } finally {
      setReturnLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {isAdmin ? 'Book Loans & Returns' : 'My Borrowed Books'}
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? 'Track active checkouts, overdue books, and handle returns.'
              : 'Review your borrowed books, upcoming due dates, and past library records.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenIssueModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition active:scale-[0.98]"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Issue New Book</span>
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit text-xs font-semibold">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'issued', label: 'Active Loans' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'returned', label: 'Completed Returns' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition ${
              statusFilter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading loan history...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ArrowLeftRight className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No transactions recorded</h3>
            <p className="text-xs text-slate-500">There are no records matching your current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Book Details</th>
                  {isAdmin && <th className="px-6 py-4">Member Info</th>}
                  <th className="px-6 py-4">Issued On</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Fine</th>
                  {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isOverdue = tx.status === 'overdue';
                  const isReturned = tx.status === 'returned';

                  return (
                    <tr key={tx._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {tx.book?.coverImage ? (
                            <img
                              src={tx.book.coverImage}
                              alt=""
                              className="w-10 h-14 object-cover rounded-lg shadow-xs flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs flex-shrink-0">
                              Book
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">
                              {tx.book?.title || 'Unknown Title'}
                            </span>
                            <span className="text-xs text-slate-500">{tx.book?.author}</span>
                            <span className="text-[11px] font-mono text-slate-400 block">
                              ISBN: {tx.book?.isbn}
                            </span>
                          </div>
                        </div>
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800 block">
                            {tx.member?.name || 'Member'}
                          </span>
                          <span className="text-xs text-slate-500 block">{tx.member?.email}</span>
                          <span className="text-[11px] font-mono text-blue-600 font-semibold">
                            {tx.member?.memberId}
                          </span>
                        </td>
                      )}

                      <td className="px-6 py-4 text-xs font-medium text-slate-700">
                        {formatDate(tx.issueDate)}
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                            {formatDate(tx.dueDate)}
                          </span>
                        </div>
                        {isReturned && (
                          <span className="text-[11px] text-emerald-600 block mt-0.5">
                            Returned: {formatDate(tx.returnDate)}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isReturned && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Returned
                          </span>
                        )}
                        {tx.status === 'issued' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3" /> Active Loan
                          </span>
                        )}
                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> Overdue
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold">
                        {tx.fine > 0 ? (
                          <span className="text-rose-600">${tx.fine}</span>
                        ) : (
                          <span className="text-slate-400 font-normal">$0</span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          {!isReturned ? (
                            <button
                              onClick={() => handleReturn(tx._id)}
                              disabled={returnLoading === tx._id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                            >
                              {returnLoading === tx._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <RotateCcw className="w-3.5 h-3.5" />
                              )}
                              <span>Process Return</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Completed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
