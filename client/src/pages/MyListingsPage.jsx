import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shirt, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MyListingsPage({ onOpenCreateListing }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchMyItems = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await apiClient.getMyItems(currentUser.id);
      if (res.success && res.items) {
        setMyItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [currentUser?.id]);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;

    try {
      const res = await apiClient.deleteItem(itemId, currentUser?.id);
      if (res.success) {
        setMyItems(prev => prev.filter(i => i.id !== itemId));
        setStatusMsg('Listing removed from marketplace.');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleStatusToggle = async (item) => {
    const nextStatus = item.status === 'available' ? 'reserved' : 'available';
    try {
      const res = await apiClient.updateItem(item.id, { status: nextStatus }, currentUser?.id);
      if (res.success) {
        setMyItems(prev => prev.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Shirt className="w-3.5 h-3.5 text-emerald-700" />
              <span>Wardrobe Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900 tracking-tight">
              My Clothing Listings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage availability, edit details, or remove clothing from circular barter.
            </p>
          </div>

          <button
            onClick={() => {
              if (onOpenCreateListing) onOpenCreateListing();
              else navigate('/create-listing');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>List New Garment</span>
          </button>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <div key={n} className="h-64 bg-stone-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : myItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <Shirt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif-display text-lg font-bold text-stone-800">
              Your Wardrobe is Empty
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-6">
              You haven't listed any pre-loved clothing yet. Put unused garments to good use and start swapping!
            </p>
            <button
              onClick={() => {
                if (onOpenCreateListing) onOpenCreateListing();
                else navigate('/create-listing');
              }}
              className="px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-800 transition shadow-sm"
            >
              List Item with AI
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-stone-100">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md text-white ${
                        item.status === 'available' ? 'bg-emerald-800/90' :
                        item.status === 'reserved' ? 'bg-amber-800/90' :
                        'bg-stone-800/90'
                      }`}>
                        {item.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                        ₹{item.estimatedValue}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span>Size: {item.size} • {item.condition}</span>
                    </div>
                    <h3 className="font-bold text-sm text-stone-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStatusToggle(item)}
                    className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 underline"
                  >
                    Mark {item.status === 'available' ? 'Reserved' : 'Available'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/listings/${item.id}`}
                      className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition"
                      title="View Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
