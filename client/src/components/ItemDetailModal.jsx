import React from 'react';
import { X, ArrowRightLeft, Star, MapPin, CheckCircle, Leaf, Sparkles, ShieldCheck } from 'lucide-react';

export default function ItemDetailModal({ 
  item, 
  currentUser, 
  onClose, 
  onProposeSwap 
}) {
  if (!item) return null;
  const isOwner = item.ownerId === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Item Image */}
          <div className="relative aspect-[4/5] md:aspect-auto bg-stone-100">
            <img 
              src={item.images?.[0]} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              Est. Value: ₹{item.estimatedValue?.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            
            <div className="space-y-4">
              
              {/* Category & Brand badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                  {item.brand}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-medium">
                  {item.category}
                </span>
              </div>

              <h2 className="font-serif-display text-2xl font-bold text-stone-900 leading-snug">
                {item.title}
              </h2>

              {/* Attributes grid */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-center">
                <div className="bg-stone-50 p-2 rounded-xl">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Size</span>
                  <span className="text-sm font-bold text-stone-800">{item.size}</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-xl">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Condition</span>
                  <span className="text-xs font-bold text-stone-800 truncate block">{item.condition}</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-xl">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Color</span>
                  <span className="text-xs font-bold text-stone-800 truncate block">{item.color || 'Classic'}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1">
                  Styling & Condition Notes
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map(t => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Owner card */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.ownerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} 
                    alt={item.ownerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-stone-900">{item.ownerName}</div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        5.0
                      </span>
                      <span>•</span>
                      <span>Verified Swapper</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eco footprint note */}
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/70 px-3 py-2 rounded-xl">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Swapping this item saves ~2,700 liters of water & 3.5 kg of CO₂!</span>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-4 border-t border-stone-100">
              {isOwner ? (
                <div className="text-center py-2.5 rounded-xl bg-stone-100 text-stone-500 text-sm font-medium">
                  This item belongs to your wardrobe
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onProposeSwap(item);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-700 shadow-md transition flex items-center justify-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Propose Swap with My Items</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
