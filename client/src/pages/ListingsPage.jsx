import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Shirt, 
  Sparkles, 
  MapPin, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { apiClient } from '../api';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Jackets & Outerwear', 'Dresses', 'Shoes', 'Accessories'];
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CONDITIONS = ['All', 'Brand New with Tags', 'Like New', 'Gently Used', 'Fair'];
const POPULAR_BRANDS = ['All', 'Zara', 'Nike', "Levi's", 'H&M', 'Uniqlo', 'Adidas'];
const CITIES = ['All', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];

export default function ListingsPage({ onProposeSwap }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [size, setSize] = useState(searchParams.get('size') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [brand, setBrand] = useState('All');
  const [location, setLocation] = useState('All');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Sync search param from URL if changed
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) setSearch(query);
  }, [searchParams]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getItems({
        category: category !== 'All' ? category : undefined,
        size: size !== 'All' ? size : undefined,
        condition: condition !== 'All' ? condition : undefined,
        brand: brand !== 'All' ? brand : undefined,
        location: location !== 'All' ? location : undefined,
        search: search.trim() || undefined,
        sort
      }, currentUser?.id);

      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, size, condition, brand, location, sort, search, currentUser?.id]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSize('All');
    setCondition('All');
    setBrand('All');
    setLocation('All');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Search Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct 1-to-1 Barter Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-display text-stone-900 tracking-tight">
              Curated Wardrobe Feed
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Discover authentic pre-loved fashion ready for exchange without monetary transaction.
            </p>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search brand, title, style..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 shadow-xs"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition ${
                showFilters ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Categories Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                category === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Extended Filter Panel */}
        {showFilters && (
          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm animate-in fade-in duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Refine Catalog</span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {/* Size */}
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {POPULAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold text-stone-600 mb-1">City / Region</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {CITIES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Bar & Sorting */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
          <p>
            Showing <span className="font-bold text-stone-900">{items.length}</span> sustainable clothing items
          </p>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent font-semibold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="value_asc">Est. Value: Low to High</option>
              <option value="value_desc">Est. Value: High to Low</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-stone-100 rounded-3xl aspect-[4/5] animate-pulse"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <Shirt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif-display text-lg font-bold text-stone-800">
              No matching clothing items found
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
              Try adjusting your filter criteria or search keyword to discover more pre-loved garments.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-800 transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                currentUser={currentUser || { id: 'guest' }}
                onSelect={(itm) => navigate(`/listings/${itm.id}`)}
                onProposeSwap={(itm) => {
                  if (onProposeSwap) onProposeSwap(itm);
                  else navigate(`/listings/${itm.id}?action=swap`);
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
