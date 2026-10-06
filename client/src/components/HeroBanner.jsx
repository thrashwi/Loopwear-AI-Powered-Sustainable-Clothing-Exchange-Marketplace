import React from 'react';
import { Sparkles, Scale, MessageSquareHeart, Droplets, Wind, Shirt } from 'lucide-react';

export default function HeroBanner({ onOpenCreateListing }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-100/60 to-transparent pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Circular Fashion Meets Intelligent AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif-display font-bold text-stone-900 tracking-tight leading-[1.15]">
            Exchange clothes directly. <br className="hidden sm:inline" />
            <span className="italic font-normal text-emerald-800">Balanced by AI.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            Trade your pre-loved styles with other fashion lovers. Our AI evaluates brand balance, writes your listings, and drafts courteous negotiation offers. Zero cash needed.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={onOpenCreateListing}
              className="px-6 py-3.5 rounded-full bg-emerald-800 text-white text-sm font-semibold shadow-lg shadow-emerald-950/15 hover:bg-emerald-700 hover:shadow-xl transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>List an Item with AI Assistance</span>
            </button>
          </div>
        </div>

        {/* 3 AI Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          
          <div className="p-5 rounded-2xl bg-white/80 border border-stone-200/70 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-sm mb-1">AI Description & Valuation</h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              Auto-generate compelling fashion descriptions and fair resale estimates (₹) based on brand, fabric, and wear condition.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 border border-stone-200/70 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-sm mb-1">AI Fair Swap Evaluator</h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              Compares brand tiers and item condition to assess equity score (e.g. 94/100) and identify whether a trade is well balanced.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 border border-stone-200/70 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-sm mb-1">AI Negotiation Assistant</h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              Live in-chat suggestions that draft polite counter-offers, bundle proposals, or logistics inquiries with one click.
            </p>
          </div>

        </div>

        {/* Environmental Impact Counter */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-900 to-forest-800 text-white p-5 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/80">
            
            <div className="pt-2 sm:pt-0 sm:px-4">
              <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Shirt className="w-4 h-4" />
                <span>Garments Diverted</span>
              </div>
              <div className="font-serif-display text-2xl sm:text-3xl font-bold">142+ Items</div>
              <p className="text-emerald-200/80 text-[11px] mt-0.5">Kept out of municipal landfills</p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4">
              <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Droplets className="w-4 h-4" />
                <span>Water Conserved</span>
              </div>
              <div className="font-serif-display text-2xl sm:text-3xl font-bold">384,000 Liters</div>
              <p className="text-emerald-200/80 text-[11px] mt-0.5">Saved from textile manufacture</p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4">
              <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Wind className="w-4 h-4" />
                <span>CO₂ Emissions Prevented</span>
              </div>
              <div className="font-serif-display text-2xl sm:text-3xl font-bold">1,130 kg</div>
              <p className="text-emerald-200/80 text-[11px] mt-0.5">Carbon offset by clothes swapping</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
