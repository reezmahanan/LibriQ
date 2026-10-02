import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../api/client';

export default function Transactions({ onOpenIssueModal }) {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
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
    if (!window.confirm('Process return & settle any fine for this book?')) return;

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
    return new Date(dateStr).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1E3A5F]">
            {isAdmin ? t('trans_admin_heading', 'Circulation Desk (Issues & Returns)') : t('trans_student_heading', 'My University Borrowed Books')}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {isAdmin
              ? t('trans_admin_sub', 'Track active loans, calculate late return penalties (Rs. 10/day), and process returns.')
              : t('trans_student_sub', 'Review your borrowed titles, due dates, and Sri Lankan Rupee overdue fines.')}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenIssueModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E3A5F] hover:bg-[#2E6F95] text-white font-bold text-sm rounded-xl shadow-md transition active:scale-95 border border-[#2E6F95]/30"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#F4B942]" />
            <span>{t('issue_book_btn', 'Issue New Book')}</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between ${
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
            className="text-xs font-bold uppercase hover:underline"
          >
            {t('dismiss', 'Dismiss')}
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs w-fit text-xs font-bold">
        {[
          { id: 'all', label: t('tab_all', 'All Records') },
          { id: 'issued', label: t('tab_active', 'Active Loans') },
          { id: 'overdue', label: t('tab_overdue', 'Overdue (Fines)') },
          { id: 'returned', label: t('tab_returned', 'Completed Returns') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition ${
              statusFilter === tab.id
                ? 'bg-[#1E3A5F] text-[#F4B942] shadow-xs'
                : 'text-[#1F2937] hover:bg-[#F7F9FC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
            <span className="text-sm font-semibold">{t('starting_lms', 'Loading circulation ledger...')}</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ArrowLeftRight className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#1E3A5F]">{t('no_trans_found', 'No circulation records found')}</h3>
            <p className="text-xs text-slate-500">{t('no_books_sub', 'There are no records matching your current filter.')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1F2937]">
              <thead className="bg-[#F7F9FC] text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">{t('th_book_acc', 'Book Details & Accession')}</th>
                  {isAdmin && <th className="px-6 py-4">{t('th_student_member', 'Student Patron')}</th>}
                  <th className="px-6 py-4">{t('th_issue_date', 'Issued On')}</th>
                  <th className="px-6 py-4">{t('th_due_date', 'Due Date')}</th>
                  <th className="px-6 py-4">{t('th_loan_status', 'Status')}</th>
                  <th className="px-6 py-4">{t('th_fine', 'Fine (LKR)')}</th>
                  {isAdmin && <th className="px-6 py-4 text-right">{t('actions', 'Circulation Action')}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isOverdue = tx.status === 'overdue';
                  const isReturned = tx.status === 'returned';

                  return (
                    <tr key={tx._id} className="hover:bg-[#F7F9FC]/70 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {tx.book?.coverImage ? (
                            <img
                              src={tx.book.coverImage}
                              alt=""
                              className="w-10 h-14 object-cover rounded-lg shadow-xs flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-[#eaf0f6] rounded-lg flex items-center justify-center text-[#1E3A5F] font-bold text-xs flex-shrink-0">
                              LQ
                            </div>
                          )}
                          <div>
                            <span className="font-extrabold text-[#1E3A5F] block line-clamp-1">
                              {tx.book?.title || 'Unknown Title'}
                            </span>
                            <span className="text-xs text-slate-500">{tx.book?.author}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {tx.book?.accessionNo && (
                                <span className="text-[10px] font-mono font-bold bg-[#edf5f9] text-[#1E3A5F] px-1.5 py-0.2 rounded">
                                  {tx.book.accessionNo}
                                </span>
                              )}
                              {tx.book?.lendingType && (
                                <span className="text-[10px] font-semibold text-slate-500">
                                  • {tx.book.lendingType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-4">
                          <span className="font-bold text-[#1F2937] block">
                            {tx.member?.name || 'Member'}
                          </span>
                          <span className="text-xs text-slate-500 block">{tx.member?.faculty}</span>
                          <span className="text-[11px] font-mono font-extrabold text-[#1E3A5F] bg-[#F4B942]/20 px-2 py-0.5 rounded inline-block mt-0.5">
                            {tx.member?.indexNo || tx.member?.memberId}
                          </span>
                        </td>
                      )}

                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        {formatDate(tx.issueDate)}
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-[#2E6F95]" />
                          <span className={isOverdue ? 'text-rose-600 font-black' : 'text-slate-700'}>
                            {formatDate(tx.dueDate)}
                          </span>
                        </div>
                        {isReturned && (
                          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                            {t('returned_on', 'Returned')}: {formatDate(tx.returnDate)}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isReturned && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('status_returned', 'Returned')}
                          </span>
                        )}
                        {tx.status === 'issued' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#edf5f9] text-[#1E3A5F] border border-[#d6e8f2]">
                            <Clock className="w-3.5 h-3.5 text-[#2E6F95]" /> {t('status_active', 'Active Loan')}
                          </span>
                        )}
                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" /> {t('status_overdue', 'Overdue')}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-black">
                        {tx.fine > 0 ? (
                          <span className="text-rose-600">Rs. {tx.fine}.00</span>
                        ) : (
                          <span className="text-slate-400 font-normal">Rs. 0.00</span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          {!isReturned ? (
                            <button
                              onClick={() => handleReturn(tx._id)}
                              disabled={returnLoading === tx._id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                            >
                              {returnLoading === tx._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <RotateCcw className="w-3.5 h-3.5" />
                              )}
                              <span>{t('btn_process_return', 'Process Return')}</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold">{t('clear', 'Cleared')}</span>
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
