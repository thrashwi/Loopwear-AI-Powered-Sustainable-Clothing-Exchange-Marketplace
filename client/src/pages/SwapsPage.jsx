import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  ChevronRight,
  Shirt,
  Leaf,
  Scale
} from 'lucide-react';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';

export default function SwapsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('incoming'); // incoming | outgoing | completed
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Counteroffer modal state
  const [counterofferSwap, setCounterofferSwap] = useState(null);
  const [counterofferText, setCounterofferText] = useState('');

  const fetchSwaps = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await apiClient.getSwaps(currentUser.id);
      if (res.success && res.swaps) {
        setSwaps(res.swaps);
      }
    } catch (err) {
      console.error('Failed to load swaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, [currentUser?.id]);

  // Actions
  const handleAccept = async (swapId) => {
    setProcessingId(swapId);
    try {
      const res = await apiClient.acceptSwap(swapId, currentUser?.id);
      if (res.success) {
        setActionMsg('Swap accepted! Both garments are now reserved. You can coordinate handover in chat.');
        fetchSwaps();
      }
    } catch (err) {
      console.error('Accept error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (swapId) => {
    setProcessingId(swapId);
    try {
      const res = await apiClient.rejectSwap(swapId, currentUser?.id);
      if (res.success) {
        setActionMsg('Swap proposal was declined.');
        fetchSwaps();
      }
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (swapId) => {
    setProcessingId(swapId);
    try {
      const res = await apiClient.cancelSwap(swapId, currentUser?.id);
      if (res.success) {
        setActionMsg('Your swap proposal was cancelled.');
        fetchSwaps();
      }
    } catch (err) {
      console.error('Cancel error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (swapId) => {
    setProcessingId(swapId);
    try {
      const res = await apiClient.completeSwap(swapId, currentUser?.id);
      if (res.success) {
        setActionMsg('🎉 Swap marked as completed! Your sustainability score has increased!');
        fetchSwaps();
      }
    } catch (err) {
      console.error('Complete error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendCounteroffer = async (e) => {
    e.preventDefault();
    if (!counterofferSwap) return;

    try {
      const res = await apiClient.counterofferSwap(counterofferSwap.id, {
        counterOfferMessage: counterofferText.trim()
      }, currentUser?.id);

      if (res.success) {
        setCounterofferSwap(null);
        setCounterofferText('');
        setActionMsg('Counteroffer submitted!');
        fetchSwaps();
      }
    } catch (err) {
      console.error('Counteroffer error:', err);
    }
  };

  // Filter swaps based on active tab
  const incomingSwaps = swaps.filter(s => s.isIncoming && s.status !== 'completed');
  const outgoingSwaps = swaps.filter(s => s.isOutgoing && s.status !== 'completed');
  const completedSwaps = swaps.filter(s => s.status === 'completed');

  const currentList = activeTab === 'incoming' 
    ? incomingSwaps 
    : activeTab === 'outgoing' 
      ? outgoingSwaps 
      : completedSwaps;

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
            <span>Exchange Lifecycle & Negotiation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900 tracking-tight">
            Swap Requests & Negotiations
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review incoming barter offers, track outgoing proposals, and finalize circular exchanges.
          </p>
        </div>

        {/* Action feedback */}
        {actionMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionMsg}</span>
            </div>
            <button onClick={() => setActionMsg('')} className="text-xs text-stone-400 hover:text-stone-700">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'incoming'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>Incoming Offers</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'incoming' ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {incomingSwaps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'outgoing'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>Outgoing Proposals</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'outgoing' ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {outgoingSwaps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>Completed History</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'completed' ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {completedSwaps.length}
            </span>
          </button>
        </div>

        {/* Swaps List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => <div key={n} className="h-48 bg-stone-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <ArrowRightLeft className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif-display text-lg font-bold text-stone-800">
              No {activeTab} swaps found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
              {activeTab === 'incoming' 
                ? 'When other members propose a barter on your wardrobe, offers will appear here.'
                : activeTab === 'outgoing'
                  ? 'You haven\'t proposed any swaps yet. Browse the community feed and propose a trade!'
                  : 'Completed swaps and circular environmental achievements will be cataloged here.'}
            </p>
            <Link
              to="/listings"
              className="px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-800 transition"
            >
              Browse Available Clothes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {currentList.map((swap) => {
              const requested = swap.requestedItem || {};
              const offeredList = swap.offeredItems || (swap.offeredItem ? [swap.offeredItem] : []);
              const ai = swap.aiFairnessAssessment;

              return (
                <div 
                  key={swap.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition duration-200 p-6 sm:p-8 space-y-6"
                >
                  {/* Top Bar: User & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={(swap.isOutgoing ? swap.recipient?.avatar : swap.requester?.avatar) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-200"
                      />
                      <div>
                        <p className="font-bold text-xs text-stone-900">
                          {swap.isOutgoing ? `Offered to ${swap.recipient?.name || 'User'}` : `Offer from ${swap.requester?.name || 'User'}`}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {new Date(swap.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        swap.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        swap.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        swap.status === 'counteroffered' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        swap.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-stone-200 text-stone-700'
                      }`}>
                        {swap.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Comparison: Offered Garment(s) vs Requested Garment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    
                    {/* Offered Side */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Offered by {swap.requester?.name || 'Requester'}
                      </span>
                      {offeredList.map((off, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={off.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'}
                            alt={off.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-stone-900 truncate">{off.title}</p>
                            <p className="text-[11px] text-stone-500">{off.brand} • Size {off.size}</p>
                            <p className="text-[11px] font-bold text-emerald-800">Est. ₹{off.estimatedValue}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Requested Side */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Requested from {swap.recipient?.name || 'Recipient'}
                      </span>
                      <div className="flex items-center gap-3">
                        <img
                          src={requested.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'}
                          alt={requested.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-stone-900 truncate">{requested.title}</p>
                          <p className="text-[11px] text-stone-500">{requested.brand} • Size {requested.size}</p>
                          <p className="text-[11px] font-bold text-emerald-800">Est. ₹{requested.estimatedValue}</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* AI Fair Swap Breakdown */}
                  {ai && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800 shrink-0">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-emerald-950">
                            AI Fairness Verdict: <span className="underline decoration-emerald-500">{ai.verdict}</span> (Fairness Score: {ai.score}/100)
                          </p>
                          <p className="text-emerald-800 text-[11px] mt-0.5">
                            {ai.analysisText || ai.recommendation}
                          </p>
                        </div>
                      </div>
                      {ai.differenceAmount !== undefined && (
                        <span className="px-3 py-1 bg-white rounded-full font-bold text-emerald-900 shadow-2xs shrink-0">
                          Diff: ₹{Math.abs(ai.differenceAmount)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* User proposal note */}
                  {swap.message && (
                    <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                      <span className="font-semibold text-stone-700">Proposal Note:</span> "{swap.message}"
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
                    <Link
                      to={`/chat/${swap.id}`}
                      className="px-4 py-2 rounded-xl border border-stone-200 hover:border-emerald-600 text-xs font-semibold text-stone-700 hover:text-emerald-800 bg-white shadow-2xs flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Negotiation Chat</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      {/* Recipient Actions (if Pending or Counteroffered) */}
                      {swap.isIncoming && (swap.status === 'pending' || swap.status === 'counteroffered') && (
                        <>
                          <button
                            onClick={() => {
                              setCounterofferSwap(swap);
                              setCounterofferText('');
                            }}
                            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold transition"
                          >
                            Counteroffer
                          </button>
                          <button
                            onClick={() => handleReject(swap.id)}
                            disabled={processingId === swap.id}
                            className="px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAccept(swap.id)}
                            disabled={processingId === swap.id}
                            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                          >
                            Accept & Reserve
                          </button>
                        </>
                      )}

                      {/* Requester Actions (if Pending) */}
                      {swap.isOutgoing && swap.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(swap.id)}
                          disabled={processingId === swap.id}
                          className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold transition"
                        >
                          Cancel Offer
                        </button>
                      )}

                      {/* Mark Completed (if Accepted) */}
                      {swap.status === 'accepted' && (
                        <button
                          onClick={() => handleComplete(swap.id)}
                          disabled={processingId === swap.id}
                          className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Mark Exchange Completed</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Counteroffer Modal */}
      {counterofferSwap && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-stone-200 shadow-2xl animate-in fade-in duration-200 space-y-4">
            <h3 className="font-bold text-base font-serif-display text-stone-900">
              Propose Counteroffer
            </h3>
            <p className="text-xs text-stone-500">
              Suggest adjusted terms or items to the requester before accepting.
            </p>
            <form onSubmit={handleSendCounteroffer} className="space-y-4">
              <textarea
                rows={4}
                required
                value={counterofferText}
                onChange={(e) => setCounterofferText(e.target.value)}
                placeholder="e.g. Could you also bundle your Nike sports cap or meet up at Indiranagar metro station?"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCounterofferSwap(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs"
                >
                  Send Counteroffer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
