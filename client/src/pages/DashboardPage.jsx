import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shirt, 
  Repeat, 
  Leaf, 
  ArrowRightLeft, 
  MessageSquare, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Droplet, 
  MapPin, 
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

export default function DashboardPage({ onOpenCreateListing, onOpenSustainability }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    if (!currentUser) return;
    try {
      const res = await apiClient.getDashboard(currentUser.id);
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [currentUser?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-stone-200 rounded-xl w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-28 bg-stone-100 rounded-2xl"></div>)}
          </div>
          <div className="h-64 bg-stone-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {
    totalListings: 0,
    activeListings: 0,
    incomingRequests: 0,
    outgoingRequests: 0,
    pendingRequests: 0,
    completedSwaps: 0,
    sustainability: { co2KgSaved: 0, waterLitersSaved: 0, garmentsDiverted: 0 }
  };

  const user = dashboardData?.user || currentUser;

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900">
                  Welcome back, {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{user.location || 'Bengaluru, India'}</span>
                <span className="text-stone-300">•</span>
                <span>⭐ {user.rating || 5.0} Rating</span>
                <span className="text-stone-300">•</span>
                <span>{user.swapsCompleted || 0} Successful Swaps</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition ${refreshing ? 'animate-spin' : ''}`}
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (onOpenCreateListing) onOpenCreateListing();
                else navigate('/create-listing');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>List New Item</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Listings */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Active Listings</span>
              <Shirt className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900">
              {metrics.activeListings}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Out of {metrics.totalListings} total in your wardrobe</p>
          </div>

          {/* Incoming Swap Offers */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Incoming Offers</span>
              <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900">
              {metrics.incomingRequests}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">{metrics.pendingRequests} awaiting response</p>
          </div>

          {/* Completed Swaps */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Completed Swaps</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-serif-display text-emerald-800">
              {metrics.completedSwaps}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Verified circular exchanges</p>
          </div>

          {/* Sustainability Score */}
          <div 
            onClick={onOpenSustainability}
            className="bg-gradient-to-tr from-emerald-900 to-emerald-800 p-5 rounded-2xl text-white shadow-2xs cursor-pointer hover:opacity-95 transition"
          >
            <div className="flex items-center justify-between text-emerald-300 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">CO₂ Avoided</span>
              <Leaf className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-serif-display text-white">
              {metrics.sustainability.co2KgSaved} kg
            </p>
            <p className="text-[11px] text-emerald-200 mt-1">
              ~{metrics.sustainability.waterLitersSaved?.toLocaleString()}L water saved
            </p>
          </div>
        </div>

        {/* Main Content Split: Swaps Activity + My Wardrobe */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recent Swap Proposals (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recent Swap Activity Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-700" />
                  <h2 className="font-serif-display font-bold text-lg text-stone-900">
                    Recent Swap Proposals
                  </h2>
                </div>
                <Link to="/swaps" className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1">
                  <span>View All Swaps</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {dashboardData?.recentSwaps?.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <Repeat className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-stone-600">No active swap proposals right now.</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Explore the catalog and make your first offer!</p>
                  <Link
                    to="/listings"
                    className="inline-block mt-3 px-4 py-2 rounded-full bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    Browse Clothes
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.recentSwaps?.map((swap) => (
                    <div 
                      key={swap.id}
                      className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 hover:bg-stone-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                          <Shirt className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-stone-900">
                              {swap.isOutgoing ? 'Offered to ' : 'Offer from '} {swap.partner?.name || 'User'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              swap.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              swap.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                              swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-stone-200 text-stone-700'
                            }`}>
                              {swap.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            For: <span className="font-medium text-stone-700">{swap.requestedItem?.title || 'Clothing item'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          to={`/chat/${swap.id}`}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-600 bg-white text-xs font-medium text-stone-700 transition flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Chat</span>
                        </Link>
                        <Link
                          to="/swaps"
                          className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-medium transition"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Wardrobe Section */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-emerald-700" />
                  <h2 className="font-serif-display font-bold text-lg text-stone-900">
                    My Active Wardrobe
                  </h2>
                </div>
                <Link to="/my-listings" className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1">
                  <span>Manage All ({dashboardData?.myListings?.length || 0})</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {dashboardData?.myListings?.length === 0 ? (
                <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <Shirt className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">You haven't listed any items for exchange yet.</p>
                  <button
                    onClick={() => {
                      if (onOpenCreateListing) onOpenCreateListing();
                      else navigate('/create-listing');
                    }}
                    className="mt-3 px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-800 transition"
                  >
                    List with AI Assistance
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {dashboardData?.myListings?.map((item) => (
                    <div 
                      key={item.id}
                      className="group p-3 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-600 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            item.status === 'available' ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-white'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-stone-900 truncate">{item.title}</h4>
                        <p className="text-[11px] text-stone-500">{item.brand} • Size {item.size}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800">₹{item.estimatedValue}</span>
                        <Link to={`/listings/${item.id}`} className="text-stone-400 hover:text-stone-700 text-[11px]">
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Messages & Nearby Discoveries */}
          <div className="space-y-6">
            
            {/* Recent Messages Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-700" />
                  <h2 className="font-serif-display font-bold text-lg text-stone-900">
                    Recent Messages
                  </h2>
                </div>
                <Link to="/chat" className="text-xs font-semibold text-emerald-800 hover:underline">
                  Inbox
                </Link>
              </div>

              {dashboardData?.recentMessages?.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6">No recent conversation messages.</p>
              ) : (
                <div className="space-y-2.5">
                  {dashboardData?.recentMessages?.map((conv) => (
                    <Link
                      key={conv.id}
                      to={`/chat/${conv.swapId || conv.id}`}
                      className="p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/60 border border-stone-200/80 transition flex items-center gap-3 block"
                    >
                      <img
                        src={conv.partner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt={conv.partner?.name || 'Partner'}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-stone-900 truncate">
                          {conv.partner?.name || 'Swapper'}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {conv.lastMessage?.text || 'Exchange chat started'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nearby & Recommended Clothing Listings */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <h2 className="font-serif-display font-bold text-lg text-stone-900">
                    Nearby Discoveries
                  </h2>
                </div>
                <Link to="/listings" className="text-xs font-semibold text-emerald-800 hover:underline">
                  More
                </Link>
              </div>

              {dashboardData?.nearbyItems?.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6">No nearby garments right now.</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.nearbyItems?.slice(0, 4).map((itm) => (
                    <Link
                      key={itm.id}
                      to={`/listings/${itm.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 transition border border-transparent hover:border-stone-200"
                    >
                      <img
                        src={itm.images[0]}
                        alt={itm.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-stone-900 truncate">{itm.title}</p>
                        <p className="text-[10px] text-stone-500 truncate mt-0.5">
                          {itm.location} • ₹{itm.estimatedValue}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
