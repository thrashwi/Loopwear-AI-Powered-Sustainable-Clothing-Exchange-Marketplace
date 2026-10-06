import React from 'react';
import { 
  Sparkles, 
  Repeat, 
  Leaf, 
  PlusCircle, 
  UserCheck, 
  Search,
  ArrowRightLeft
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  users, 
  onSwitchUser, 
  onOpenCreateListing, 
  onOpenMySwaps,
  onOpenSustainability,
  pendingSwapsCount,
  searchQuery,
  setSearchQuery
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-forest-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10">
              <Repeat className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900 block leading-none">
                LOOPWEAR
              </span>
              <span className="text-[10px] tracking-widest font-semibold uppercase text-emerald-700 block mt-1">
                AI Clothing Barter
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by brand, item, or style (e.g., Zara denim, Nike)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100/90 border border-stone-200/80 rounded-full text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 transition"
            />
          </div>

          {/* Actions & User Controls */}
          <div className="flex items-center gap-3">
            
            {/* Eco Impact Quick Button */}
            <button 
              onClick={onOpenSustainability}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition"
              title="View your environmental impact"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Eco Impact</span>
            </button>

            {/* My Swaps Button */}
            <button 
              onClick={onOpenMySwaps}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-stone-200 shadow-sm text-stone-700 text-sm font-medium hover:border-emerald-600 hover:text-emerald-700 transition"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
              <span>My Swaps</span>
              {pendingSwapsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                  {pendingSwapsCount}
                </span>
              )}
            </button>

            {/* List an Item (with AI badge) */}
            <button 
              onClick={onOpenCreateListing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-emerald-800 shadow-md shadow-stone-900/10 transition group"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition" />
              <span>List Item</span>
            </button>

            {/* User Switcher Dropdown */}
            <div className="relative pl-2 border-l border-stone-200">
              <div className="flex items-center gap-2 bg-stone-100/90 py-1.5 px-3 rounded-full border border-stone-200">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-600"
                />
                <select 
                  value={currentUser.id} 
                  onChange={(e) => onSwitchUser(e.target.value)}
                  className="bg-transparent text-xs font-medium text-stone-700 focus:outline-none cursor-pointer pr-1"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
