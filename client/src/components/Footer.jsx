import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, RefreshCw, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white text-stone-700">
      {/* Top sustainability banner */}
      <div className="bg-emerald-900 text-emerald-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-xl text-emerald-300">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Every Swapped Garment Saves ~3.5kg CO₂ and 1,800L Water</p>
              <p className="text-xs text-emerald-300">Join our circular fashion community and divert wearable clothing from landfills.</p>
            </div>
          </div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Explore Wardrobes
          </Link>
        </div>
      </div>

      {/* Main Footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
              </div>
              <span className="font-serif-display font-bold text-stone-900 text-xl tracking-tight">LOOPWEAR</span>
            </Link>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              AI-powered sustainable fashion exchange marketplace. Swap pre-loved clothing directly without monetary transactions.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bengaluru, Mumbai, Delhi & Pan-India</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/listings" className="hover:text-emerald-800 transition">Browse Clothing</Link></li>
              <li><Link to="/create-listing" className="hover:text-emerald-800 transition">List Your Clothes</Link></li>
              <li><Link to="/swaps" className="hover:text-emerald-800 transition">Swap Proposals</Link></li>
              <li><Link to="/chat" className="hover:text-emerald-800 transition">Negotiation Chat</Link></li>
            </ul>
          </div>

          {/* Platform & AI */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Intelligent Features</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-emerald-700" /> AI Description Generator</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-700" /> AI Fair Swap Evaluator</li>
              <li className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3 text-emerald-700" /> AI Negotiation Assistant</li>
              <li className="flex items-center gap-1.5"><Leaf className="w-3 h-3 text-emerald-700" /> Sustainability Impact Engine</li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Account & Admin</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-emerald-800 transition">User Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-800 transition">Profile & Impact</Link></li>
              <li><Link to="/login" className="hover:text-emerald-800 transition">Login / Register</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-800 transition text-emerald-900 font-medium">Administrator Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} Loopwear Inc. Built for Circular Fashion and Unified Mentor project evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Zero-Key Fallback Enabled</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-400">Gemini 1.5 Flash Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
