import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Jackets & Outerwear',
  'Shoes'
];

const CONDITIONS = [
  'All',
  'Brand New with Tags',
  'Like New',
  'Gently Used'
];

const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL'];

export default function FilterBar({ filters, setFilters, onReset }) {
  return (
    <div className="bg-white border-y border-stone-200/80 py-4 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mr-2 flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Categories:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filters.category === cat
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary filters: Condition & Size */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Condition pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-400 font-medium">Condition:</span>
              <select
                value={filters.condition}
                onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                className="text-xs bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {CONDITIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Size selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-400 font-medium">Size:</span>
              <select
                value={filters.size}
                onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                className="text-xs bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {SIZES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Reset Filters button */}
          {(filters.category !== 'All' || filters.condition !== 'All' || filters.size !== 'All') && (
            <button
              onClick={onReset}
              className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
