import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  Shirt, 
  Repeat, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  Leaf, 
  Droplet,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('analytics'); // analytics | users | listings | reports
  const [analytics, setAnalytics] = useState(null);
  const [userList, setUserList] = useState([]);
  const [listingsList, setListingsList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  // Access check
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const loadAdminData = async () => {
    if (!currentUser || !isAdmin) return;
    setLoading(true);
    try {
      const [anaRes, usersRes, listRes, repRes] = await Promise.all([
        apiClient.getAdminAnalytics(currentUser.id),
        apiClient.getAdminUsers(currentUser.id),
        apiClient.getAdminListings(currentUser.id),
        apiClient.getAdminReports(currentUser.id)
      ]);

      if (anaRes.success) setAnalytics(anaRes.analytics);
      if (usersRes.success) setUserList(usersRes.users);
      if (listRes.success) setListingsList(listRes.listings);
      if (repRes.success) setReportsList(repRes.reports);
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [currentUser?.id, isAdmin]);

  // Actions
  const handleToggleUserStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await apiClient.updateAdminUserStatus(user.id, nextStatus, currentUser.id);
      if (res.success) {
        setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
        setStatusMsg(`User ${user.name} is now ${nextStatus}.`);
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('User status error:', err);
    }
  };

  const handleDeleteListing = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this listing for violating guidelines?')) return;
    try {
      const res = await apiClient.deleteAdminListing(itemId, currentUser.id);
      if (res.success) {
        setListingsList(prev => prev.filter(i => i.id !== itemId));
        setStatusMsg('Listing removed from marketplace.');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('Delete listing error:', err);
    }
  };

  const handleResolveReport = async (reportId, newStatus) => {
    try {
      const res = await apiClient.updateAdminReport(reportId, { status: newStatus }, currentUser.id);
      if (res.success) {
        setReportsList(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
        setStatusMsg(`Report ${reportId} marked as ${newStatus}.`);
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('Resolve report error:', err);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-800 rounded-2xl text-emerald-300">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                  Loopwear Administrator Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-emerald-100">
                  Role: Super Admin
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Server-enforced administrative oversight, content moderation, dispute handling, and circular impact metrics
              </p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'analytics'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'users'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Users ({userList.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'listings'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Listings Moderation ({listingsList.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'reports'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Disputes & Reports ({reportsList.length})
          </button>
        </div>

        {/* Tab 1: Analytics Overview */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Total Registered Users</span>
                <p className="text-3xl font-extrabold font-serif-display text-stone-900 mt-1">{analytics.users.total}</p>
                <p className="text-[11px] text-stone-400 mt-1">{analytics.users.active} active accounts</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Marketplace Garments</span>
                <p className="text-3xl font-extrabold font-serif-display text-stone-900 mt-1">{analytics.listings.total}</p>
                <p className="text-[11px] text-stone-400 mt-1">{analytics.listings.active} available to barter</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Completed Swaps</span>
                <p className="text-3xl font-extrabold font-serif-display text-emerald-800 mt-1">{analytics.swaps.completed}</p>
                <p className="text-[11px] text-stone-400 mt-1">{analytics.swaps.pending} pending negotiation</p>
              </div>

              <div className="bg-gradient-to-tr from-emerald-950 to-emerald-900 p-5 rounded-2xl text-white shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">CO₂ Saved Platform-Wide</span>
                <p className="text-3xl font-extrabold font-serif-display text-white mt-1">{analytics.sustainability.totalCo2SavedKg} kg</p>
                <p className="text-[11px] text-emerald-300 mt-1">~{analytics.sustainability.totalWaterSavedLiters?.toLocaleString()}L water saved</p>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif-display font-bold text-base text-stone-900">Recent Administrative Audit Logs</h3>
              <div className="space-y-2 text-xs">
                {analytics.recentAuditLogs?.map(log => (
                  <div key={log.id} className="p-3 bg-stone-50 rounded-xl flex items-center justify-between border border-stone-200/60">
                    <div>
                      <span className="font-bold text-stone-900 mr-2">[{log.action}]</span>
                      <span className="text-stone-600">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0 ml-2">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900">All Registered Users ({userList.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Listings</th>
                    <th className="p-4">Swaps</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {userList.map(u => (
                    <tr key={u.id} className="hover:bg-stone-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-stone-900">{u.name}</p>
                          <p className="text-[11px] text-stone-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-stone-600">{u.location}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-stone-800">{u.listingCount || 0}</td>
                      <td className="p-4 font-semibold text-stone-800">{u.swapsCompleted || 0}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-3 py-1 rounded-full font-bold text-[11px] transition ${
                              u.status === 'active' 
                                ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Listings Moderation */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">Marketplace Listings ({listingsList.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Est. Value</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {listingsList.map(item => (
                    <tr key={item.id} className="hover:bg-stone-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={item.images[0]} alt={item.title} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-stone-400">{item.brand} • Size {item.size}</p>
                        </div>
                      </td>
                      <td className="p-4 text-stone-600">{item.category}</td>
                      <td className="p-4 text-stone-600">{item.ownerName}</td>
                      <td className="p-4 font-bold text-emerald-800">₹{item.estimatedValue}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Disputes & Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Community Reports ({reportsList.length})</h3>
            {reportsList.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No reports filed.</p>
            ) : (
              <div className="space-y-3">
                {reportsList.map(rep => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">Report #{rep.id}</span>
                        <span className="px-2 py-0.5 rounded bg-stone-200 text-[10px] font-bold uppercase">
                          Target: {rep.targetType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-1">Reason: "{rep.reason}"</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Reported by {rep.reporterName}</p>
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'dismissed')}
                          className="px-3 py-1 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 text-[11px] font-semibold"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'resolved')}
                          className="px-3 py-1 rounded-full bg-emerald-800 text-white hover:bg-emerald-700 text-[11px] font-bold"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
