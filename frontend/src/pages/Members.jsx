import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  SendHorizontal,
  Loader2,
  UserCheck,
  GraduationCap,
  Building,
  CreditCard
} from 'lucide-react';
import api from '../api/client';

export default function Members({ onIssueToMember }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      let params = {};
      if (search) params.search = search;
      const res = await api.get('/users/members', { params });
      if (res.data?.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMembers();
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1E3A5F]">
            Student & Staff Patron Directory
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage university student registrations, faculty cards, and active circulation borrow allowances.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Student Name, Index No (23IT...), NIC, or Faculty..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#1E3A5F] text-[#F4B942] text-xs font-bold rounded-lg hover:bg-[#2E6F95] transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Members Grid / Cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
          <span className="text-sm font-semibold">Loading student roster...</span>
        </div>
      ) : members.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-slate-200 shadow-xs text-center space-y-2">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#1E3A5F]">No university patrons found</h3>
          <p className="text-xs text-slate-500">Try searching with index number or name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 space-y-4 flex flex-col justify-between hover:border-[#2E6F95]/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1E3A5F] text-[#F4B942] font-black text-base flex items-center justify-center border border-[#2E6F95]/30 shadow-xs">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#1E3A5F] text-sm">{member.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-mono font-bold text-[#1E3A5F] bg-[#F4B942]/20 px-2 py-0.5 rounded border border-[#F4B942]/30">
                          {member.indexNo || member.memberId || 'LK-PATRON'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <UserCheck className="w-3 h-3 text-emerald-600" /> Active
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-[#2E6F95]" />
                    <span className="truncate font-medium">{member.faculty || 'Faculty of Information Technology'}</span>
                  </div>
                  {member.nic && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-[#2E6F95]" />
                      <span className="font-mono text-slate-500">NIC: {member.nic}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Enrolled: {formatDate(member.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Circulation</span>
                  <span className="font-black text-[#1E3A5F]">
                    {member.activeBorrowsCount || 0} books on loan
                  </span>
                </div>

                <button
                  onClick={() => onIssueToMember(member._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#eaf0f6] hover:bg-[#1E3A5F] text-[#1E3A5F] hover:text-[#F4B942] font-bold text-xs rounded-xl transition border border-[#d4e0ee]"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>Issue Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
