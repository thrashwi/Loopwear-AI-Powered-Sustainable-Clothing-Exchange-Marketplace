import React from 'react';
import { ArrowRightLeft, Sparkles, Tag, CheckCircle2 } from 'lucide-react';

export default function ItemCard({ 
  item, 
  currentUser, 
  onSelect, 
  onProposeSwap 
}) {
  const isOwner = item.ownerId === currentUser.id;

  const getConditionColor = (cond) => {
    switch (cond) {
      case 'Brand New with Tags':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Like New':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Gently Used':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      
      {/* Image container */}
      <div 
        className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onSelect(item)}
      >
        <img 
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
            {item.brand}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-md ${getConditionColor(item.condition)}`}>
            {item.condition}
          </span>
        </div>

        {/* Value overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold shadow-sm">
          Est. Value: ₹{item.estimatedValue?.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
            <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              {item.category}
            </span>
            <span className="font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
              Size: {item.size}
            </span>
          </div>

          <h3 
            onClick={() => onSelect(item)}
            className="font-medium text-stone-900 text-sm line-clamp-2 cursor-pointer hover:text-emerald-800 transition"
          >
            {item.title}
          </h3>

          <p className="text-stone-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
            {item.description}
          </p>

        </div>

        {/* Footer & Actions */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          
          {/* Owner info */}
          <div className="flex items-center gap-2">
            <img 
              src={item.ownerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} 
              alt={item.ownerName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-stone-600 truncate max-w-[90px]">
              {isOwner ? 'You' : item.ownerName?.split(' ')[0]}
            </span>
          </div>

          {/* Action button */}
          {isOwner ? (
            <span className="px-3 py-1.5 text-xs text-stone-400 bg-stone-50 border border-stone-200 rounded-full font-medium">
              Your Listing
            </span>
          ) : (
            <button
              onClick={() => onProposeSwap(item)}
              className="px-3.5 py-1.5 rounded-full bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Propose Swap</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
