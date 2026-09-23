import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import {
  BookOpen,
  BookmarkCheck,
  Clock,
  AlertTriangle,
  Users,
  Coins,
  ArrowUpRight,
  PlusCircle,
  Search,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import api from '../api/client';

export default function Dashboard({ setActiveTab, onOpenIssueModal, onOpenAddBookModal }) {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions/dashboard');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-8 shadow-xl shadow-blue-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100">
              {isAdmin ? 'Librarian Administration' : `Member Portal • ${user.memberId || 'Active'}`}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              {isAdmin
                ? 'Manage catalog books, track live loan statuses, and issue books to registered students.'
                : 'Browse the digital library collection, view your active borrowed books, and track upcoming return deadlines.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={onOpenIssueModal}
                  className="px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-blue-700" />
                  <span>Issue Book</span>
                </button>
                <button
                  onClick={onOpenAddBookModal}
                  className="px-4 py-2.5 bg-blue-600/60 hover:bg-blue-600 text-white border border-white/20 font-semibold text-sm rounded-xl transition flex items-center gap-2 backdrop-blur-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Add Book</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('books')}
                className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Browse Catalog</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient geometric background shapes */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Books"
            value={stats?.totalBooks || 0}
            subtitle={`${stats?.totalCopies || 0} total physical copies`}
            icon={BookOpen}
            color="blue"
          />
          <StatsCard
            title="Active Borrows"
            value={stats?.activeBorrows || 0}
            subtitle={`${stats?.availableCopies || 0} copies in library`}
            icon={BookmarkCheck}
            color="emerald"
          />
          <StatsCard
            title="Overdue Returns"
            value={stats?.overdueBorrows || 0}
            subtitle={stats?.overdueBorrows ? 'Action required' : 'All loans on time'}
            icon={AlertTriangle}
            color="rose"
          />
          <StatsCard
            title="Registered Members"
            value={stats?.totalMembers || 0}
            subtitle={`$${stats?.totalFines || 0} total fines due`}
            icon={Users}
            color="purple"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Currently Borrowed"
            value={stats?.myActiveBorrows || 0}
            subtitle="Books in your possession"
            icon={BookOpen}
            color="blue"
          />
          <StatsCard
            title="Overdue Books"
            value={stats?.myOverdue || 0}
            subtitle={stats?.myOverdue > 0 ? 'Late return alert' : 'No overdue items'}
            icon={AlertTriangle}
            color={stats?.myOverdue > 0 ? 'rose' : 'emerald'}
          />
          <StatsCard
            title="Total Borrows"
            value={stats?.myTotalBorrows || 0}
            subtitle="Lifetime borrowing history"
            icon={BookmarkCheck}
            color="purple"
          />
          <StatsCard
            title="Fines Due"
            value={`$${stats?.myFines || 0}`}
            subtitle={stats?.myFines > 0 ? 'Outstanding overdue fine' : 'Account in good standing'}
            icon={Coins}
            color={stats?.myFines > 0 ? 'amber' : 'emerald'}
          />
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold text-slate-900 text-base">
              {isAdmin ? 'Recent Issue & Return Transactions' : 'Your Recent Activity'}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Book</th>
                {isAdmin && <th className="px-6 py-3.5">Member</th>}
                <th className="px-6 py-3.5">Issue Date</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {tx.book?.title || 'Unknown Title'}
                      <span className="block text-xs font-normal text-slate-400">{tx.book?.author}</span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">{tx.member?.name || 'Member'}</span>
                        <span className="block text-xs text-slate-400">{tx.member?.memberId}</span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-xs">{formatDate(tx.issueDate)}</td>
                    <td className="px-6 py-4 text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(tx.dueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'returned' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Returned
                        </span>
                      )}
                      {tx.status === 'issued' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="w-3 h-3" /> Borrowed
                        </span>
                      )}
                      {tx.status === 'overdue' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {tx.fine > 0 ? (
                        <span className="text-rose-600">${tx.fine}</span>
                      ) : (
                        <span className="text-slate-400">$0</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-slate-400">
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
