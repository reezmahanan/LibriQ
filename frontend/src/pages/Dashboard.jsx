import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Coins,
  ArrowUpRight,
  Plus,
  Search,
  Calendar,
  Building2
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
    return new Date(dateStr).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E3A5F] via-[#234d77] to-[#2E6F95] text-white p-6 sm:p-8 shadow-xl shadow-[#1E3A5F]/15 border border-[#2E6F95]/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-[#F4B942] border border-[#F4B942]/30">
                <Building2 className="w-3.5 h-3.5" />
                {isAdmin ? 'Senior Librarian / நூலகர்' : `Student Card: ${user.indexNo || user.memberId || 'Active'}`}
              </span>
              <span className="text-[11px] text-blue-200 hidden sm:inline">
                பல்கலைக்கழக நூலகம் • University Library
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              வணக்கம் / Welcome, {user?.name}
            </h1>
            <p className="text-blue-100/90 text-sm max-w-xl leading-relaxed">
              {isAdmin
                ? 'Manage catalog accessions, student circulation loans, and calculate late return fines in Sri Lankan Rupees (Rs. LKR).'
                : 'Search course textbooks, check physical stack locations, and track your active university library loans.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={onOpenIssueModal}
                  className="px-4 py-2.5 bg-[#F4B942] hover:bg-[#e5aa2d] text-[#1E3A5F] font-black text-sm rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#1E3A5F]" />
                  <span>Issue Book / இரவல்</span>
                </button>
                <button
                  onClick={onOpenAddBookModal}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-sm rounded-xl transition flex items-center gap-2 backdrop-blur-sm"
                >
                  <BookOpen className="w-4 h-4 text-[#F4B942]" />
                  <span>Add Accession / சேர்ப்பு</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('books')}
                className="px-5 py-2.5 bg-[#F4B942] hover:bg-[#e5aa2d] text-[#1E3A5F] font-black text-sm rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search Catalog / தேடல்</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-14 w-60 h-60 bg-[#F4B942]/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Catalog Titles"
            value={stats?.totalBooks || 0}
            subtitle="மொத்த புத்தகங்கள் (Library Copies)"
            icon={BookOpen}
            color="primary"
          />
          <StatsCard
            title="Active Circulation Loans"
            value={stats?.activeBorrows || 0}
            subtitle="கடன் வழங்கப்பட்டவை (Issued)"
            icon={CheckCircle}
            color="secondary"
          />
          <StatsCard
            title="Overdue Returns"
            value={stats?.overdueBorrows || 0}
            subtitle="தவணை கடந்தவை (Fine Applicable)"
            icon={AlertCircle}
            color="rose"
          />
          <StatsCard
            title="Total Fines Due"
            value={`Rs. ${stats?.totalFines || 0}.00`}
            subtitle="தாமதக் கட்டணம் (Rs. 10 / Day)"
            icon={Coins}
            color="accent"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Currently Borrowed"
            value={stats?.myActiveBorrows || 0}
            subtitle="கைவசம் உள்ள நூல்கள்"
            icon={BookOpen}
            color="primary"
          />
          <StatsCard
            title="Overdue Items"
            value={stats?.myOverdue || 0}
            subtitle="தவணை கடந்த நூல்கள்"
            icon={AlertCircle}
            color={stats?.myOverdue > 0 ? 'rose' : 'emerald'}
          />
          <StatsCard
            title="Total Borrowed"
            value={stats?.myTotalBorrows || 0}
            subtitle="மொத்த இரவல்கள் (Lifetime)"
            icon={CheckCircle}
            color="secondary"
          />
          <StatsCard
            title="Outstanding Fine"
            value={`Rs. ${stats?.myFines || 0}.00`}
            subtitle="செலுத்த வேண்டிய கட்டணம்"
            icon={Coins}
            color={stats?.myFines > 0 ? 'accent' : 'emerald'}
          />
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eaf0f6] text-[#1E3A5F] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#1E3A5F] text-base leading-tight">
                {isAdmin ? 'Recent Issue & Return Circulation' : 'Your Borrowing Activity'}
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">சமீபத்திய இரவல் மற்றும் மீளளித்தல் பதிவுகள்</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-bold text-[#2E6F95] hover:text-[#1E3A5F] flex items-center gap-1 hover:underline"
          >
            <span>View All / அனைத்தும்</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1F2937]">
            <thead className="bg-[#F7F9FC] text-xs uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Book Title & Acc No / புத்தகம்</th>
                {isAdmin && <th className="px-6 py-3.5">Student Patron / மாணவர்</th>}
                <th className="px-6 py-3.5">Issued / திகதி</th>
                <th className="px-6 py-3.5">Due / தவணை</th>
                <th className="px-6 py-3.5">Status / நிலை</th>
                <th className="px-6 py-3.5 text-right">Fine (LKR) / கட்டணம்</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[#F7F9FC]/70 transition">
                    <td className="px-6 py-4 font-semibold text-[#1F2937]">
                      {tx.book?.title || 'Unknown Title'}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-normal text-slate-500">{tx.book?.author}</span>
                        {tx.book?.accessionNo && (
                          <span className="text-[10px] font-mono font-bold bg-[#eaf0f6] text-[#1E3A5F] px-1.5 py-0.2 rounded">
                            {tx.book.accessionNo}
                          </span>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#1F2937] block">{tx.member?.name || 'Patron'}</span>
                        <span className="text-xs font-mono font-semibold text-[#2E6F95]">
                          {tx.member?.indexNo || tx.member?.memberId}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{formatDate(tx.issueDate)}</td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-[#2E6F95]" />
                        {formatDate(tx.dueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'returned' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Returned (மீளளிக்கப்பட்டது)
                        </span>
                      )}
                      {tx.status === 'issued' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#edf5f9] text-[#1E3A5F] border border-[#d6e8f2]">
                          <Clock className="w-3 h-3 text-[#2E6F95]" /> Active Loan (இரவல்)
                        </span>
                      )}
                      {tx.status === 'overdue' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> Overdue (தாமதம்)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-black">
                      {tx.fine > 0 ? (
                        <span className="text-rose-600">Rs. {tx.fine}.00</span>
                      ) : (
                        <span className="text-slate-400 font-normal">Rs. 0.00</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-slate-400">
                    No recent circulation transactions found.
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
