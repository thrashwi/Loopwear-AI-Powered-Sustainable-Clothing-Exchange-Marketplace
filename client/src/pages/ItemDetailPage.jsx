import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRightLeft, 
  Sparkles, 
  Leaf, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Flag, 
  CheckCircle2, 
  Clock, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

export default function ItemDetailPage({ onProposeSwap }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [otherItems, setOtherItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      try {
        const res = await apiClient.getItem(id);
        if (res.success && res.item) {
          setItem(res.item);
          setOwner(res.owner);
          setOtherItems(res.otherItems || []);
        }
      } catch (err) {
        console.error('Failed to load item:', err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    try {
      const res = await apiClient.submitReport({
        targetType: 'item',
        targetId: item.id,
        reason: reportReason.trim()
      }, currentUser?.id);

      if (res.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setIsReportOpen(false);
          setReportSuccess(false);
          setReportReason('');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-stone-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded-xl w-3/4"></div>
            <div className="h-6 bg-stone-100 rounded-lg w-1/4"></div>
            <div className="h-24 bg-stone-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-serif-display text-stone-800">Item Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">This listing may have been exchanged or removed.</p>
        <Link to="/listings" className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && item.ownerId === currentUser.id;
  const isAvailable = item.status === 'available';

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous view</span>
        </button>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm relative group">
              <img
                src={item.images[activeImageIndex] || item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                item.status === 'available' ? 'bg-emerald-900/90 text-white' :
                item.status === 'reserved' ? 'bg-amber-900/90 text-white' :
                'bg-stone-900/90 text-white'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Thumbnail selector if multiple images */}
            {item.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                      activeImageIndex === idx ? 'border-emerald-700 ring-2 ring-emerald-600/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title, Brand, Estimated Barter Value */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-bold text-xs">
                  {item.brand}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900 mt-2 leading-tight">
                  {item.title}
                </h1>
              </div>

              {/* Barter Value Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Estimated Barter Value
                  </span>
                  <p className="text-2xl font-extrabold font-serif-display text-emerald-900">
                    ₹{item.estimatedValue?.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>AI Assessed</span>
                </div>
              </div>

              {/* Garment Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-semibold text-stone-800">{item.category}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Size</span>
                  <span className="font-semibold text-stone-800">{item.size}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Condition</span>
                  <span className="font-semibold text-stone-800">{item.condition}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Color</span>
                  <span className="font-semibold text-stone-800">{item.color || 'Neutral'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  About this garment
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                {isOwner ? (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center font-medium">
                    This is your listing. You cannot propose a swap on your own wardrobe item.
                  </div>
                ) : !isAvailable ? (
                  <div className="p-3 rounded-2xl bg-stone-100 text-stone-600 text-xs text-center font-medium">
                    This item is currently {item.status} and cannot receive new swap offers.
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!currentUser) navigate('/login');
                      else if (onProposeSwap) onProposeSwap(item);
                      else navigate(`/swaps?propose=${item.id}`);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-900/10 transition flex items-center justify-center gap-2 group"
                  >
                    <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition duration-300" />
                    <span>Propose Barter Swap</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="hover:text-red-600 flex items-center gap-1 transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report listing</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>{item.location || owner?.location || 'Bengaluru, India'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Info Card */}
            {owner && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={owner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={owner.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-600/30"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">{owner.name}</h4>
                    <p className="text-[11px] text-stone-500">
                      ⭐ {owner.rating} Rating • {owner.swapsCompleted} Swaps
                    </p>
                    <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                      🌱 {owner.sustainabilityScore?.co2KgSaved || 0}kg CO₂ saved
                    </p>
                  </div>
                </div>

                {!isOwner && (
                  <button
                    onClick={() => {
                      if (!currentUser) navigate('/login');
                      else navigate(`/chat`);
                    }}
                    className="px-4 py-2 rounded-xl border border-stone-200 hover:border-emerald-600 text-xs font-semibold text-stone-700 hover:text-emerald-800 transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Chat</span>
                  </button>
                )}
              </div>
            )}

            {/* Environmental Impact Callout */}
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-emerald-900 to-forest-800 text-emerald-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-800/80 rounded-2xl text-emerald-300">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Circular Fashion Impact</p>
                <p className="text-emerald-200 mt-0.5">
                  Exchanging this {item.category.toLowerCase()} avoids manufacturing emissions of ~3.5kg CO₂ and preserves ~1,800L of water.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* More items by same owner */}
        {otherItems.length > 0 && (
          <div className="pt-10 border-t border-stone-200 space-y-6">
            <h3 className="text-lg font-bold font-serif-display text-stone-900">
              More from {owner?.name}'s Wardrobe
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherItems.map(itm => (
                <ItemCard
                  key={itm.id}
                  item={itm}
                  currentUser={currentUser || { id: 'guest' }}
                  onSelect={(selected) => navigate(`/listings/${selected.id}`)}
                  onProposeSwap={(selected) => {
                    if (onProposeSwap) onProposeSwap(selected);
                    else navigate(`/listings/${selected.id}?action=swap`);
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-stone-200 shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">Report Listing to Moderation</h3>
            <p className="text-xs text-stone-500 mb-4">
              Explain why this listing violates Loopwear community guidelines.
            </p>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you. Your report has been submitted to moderation.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="e.g. Inappropriate item, counterfeit product, inaccurate condition description..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
