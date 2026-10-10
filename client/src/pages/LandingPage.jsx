import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Repeat, 
  Leaf, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Shirt, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  MapPin,
  Scale
} from 'lucide-react';
import { apiClient } from '../api';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onOpenCreateListing, onOpenSustainability }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await apiClient.getItems({}, currentUser?.id);
        if (res.success && res.items) {
          setFeaturedItems(res.items.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, [currentUser?.id]);

  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Sustainability Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Next-Gen Circular Economy & AI Wardrobe Barter</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-serif-display text-stone-900 tracking-tight leading-[1.1] mb-6">
              Swap Wardrobes, <br />
              <span className="text-emerald-800 underline decoration-emerald-300 decoration-wavy decoration-2">
                Not Cash.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Loopwear replaces fast-fashion consumption with 1-to-1 direct garment exchanges. 
              Discover curated pre-loved styles, negotiate fair trades with built-in AI valuation, 
              and cut your carbon footprint with zero monetary spend.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/listings"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-900 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-stone-900/10 transition flex items-center justify-center gap-2 group"
              >
                <span>Browse Clothes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to={currentUser ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <Repeat className="w-4 h-4 text-emerald-700" />
                <span>Start Swapping Free</span>
              </Link>
            </div>

            {/* Environmental Micro-Stats */}
            <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto pt-8 border-t border-stone-200/80">
              <div>
                <p className="text-2xl font-bold font-serif-display text-emerald-800">100%</p>
                <p className="text-xs text-stone-500 font-medium">Cashless Barter</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif-display text-emerald-800">3.5kg</p>
                <p className="text-xs text-stone-500 font-medium">CO₂ Saved / Swap</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif-display text-emerald-800">1,800L</p>
                <p className="text-xs text-stone-500 font-medium">Water Diverted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Simple 3-Step Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 mt-1">
              How Loopwear Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Exchange unused fashion gems in three straightforward, transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-stone-50/80 border border-stone-200 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-6">
                1
              </div>
              <h3 className="font-serif-display font-bold text-lg text-stone-900 mb-2">
                List Pre-Loved Pieces
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Snap photos of clothes you no longer wear. Our AI generator creates crisp titles, compelling descriptions, and estimated barter values instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-stone-50/80 border border-stone-200 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-6">
                2
              </div>
              <h3 className="font-serif-display font-bold text-lg text-stone-900 mb-2">
                Evaluate Fair Trade with AI
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pick an item you covet and offer 1 or more garments from your wardrobe. Our AI Fair Swap Evaluator verifies parity and offers negotiation tips.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-stone-50/80 border border-stone-200 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-6">
                3
              </div>
              <h3 className="font-serif-display font-bold text-lg text-stone-900 mb-2">
                Exchange & Track Impact
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Chat in real-time to confirm handover. Mark the exchange complete to instantly earn personal sustainability score points in CO₂ and water conservation!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clothing Listings */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Marketplace Spotlight</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 mt-1">
              Featured Wardrobe Exchanges
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Top curated items available for 1-to-1 barter from verified community swappers.
            </p>
          </div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-stone-100 rounded-3xl aspect-[4/5] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                currentUser={currentUser || { id: 'guest' }}
                onSelect={(itm) => navigate(`/listings/${itm.id}`)}
                onProposeSwap={(itm) => {
                  if (!currentUser) navigate('/login');
                  else navigate(`/listings/${itm.id}?action=swap`);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3 Pillars of AI Intelligence Section */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Smart Technology</span>
            <h2 className="text-3xl font-bold font-serif-display mt-2">
              AI-Powered Precision at Every Step
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-2">
              Loopwear combines Google Gemini with rule-based heuristics so you can make informed, equitable swaps without hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-stone-800/80 border border-stone-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-emerald-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Description Generator</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Automatically synthesizes garment titles, detailed fashion descriptions, condition tags, and fair barter value suggestions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-800/80 border border-stone-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-emerald-400 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Fair Swap Evaluator</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Compares brands, categories, and wear condition across single or bundle proposals, computing fairness scores and advice.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-800/80 border border-stone-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-emerald-400 flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Sustainability Engine</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Calculates environmental savings in CO₂ kilograms, liters of freshwater preserved, and textile waste prevented.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Callout */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-900 to-forest-800 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-display mb-4">
            Ready to Refresh Your Wardrobe Sustainably?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto mb-8">
            Create your account today, list your first clothing item in under a minute with AI assistance, and join the circular fashion revolution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-white text-stone-900 font-bold text-sm hover:bg-stone-100 transition shadow-md"
            >
              Sign Up Free
            </Link>
            <Link
              to="/listings"
              className="px-8 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm border border-emerald-600 transition"
            >
              Explore Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
