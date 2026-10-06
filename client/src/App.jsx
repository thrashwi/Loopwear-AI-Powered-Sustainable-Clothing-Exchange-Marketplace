import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import ItemCard from './components/ItemCard';
import ItemDetailModal from './components/ItemDetailModal';
import CreateListingModal from './components/CreateListingModal';
import SwapProposalModal from './components/SwapProposalModal';
import MySwapsModal from './components/MySwapsModal';
import SustainabilityModal from './components/SustainabilityModal';
import { apiClient } from './api';
import { Sparkles, Shirt, RefreshCw } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    id: 'user_1',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    swapsCompleted: 12,
    sustainabilityScore: { co2KgSaved: 48, waterLitersSaved: 15400, garmentsDiverted: 14 }
  });

  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [pendingSwapsCount, setPendingSwapsCount] = useState(1);

  // Filters state
  const [filters, setFilters] = useState({
    category: 'All',
    condition: 'All',
    size: 'All'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [selectedItemForSwap, setSelectedItemForSwap] = useState(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isMySwapsOpen, setIsMySwapsOpen] = useState(false);
  const [isSustainabilityOpen, setIsSustainabilityOpen] = useState(false);

  // Initialize
  useEffect(() => {
    loadUsers();
    loadItems();
    loadPendingCount();
  }, [currentUser.id]);

  // Refetch items when filters change
  useEffect(() => {
    loadItems();
  }, [filters, searchQuery, currentUser.id]);

  const loadUsers = async () => {
    try {
      const res = await apiClient.getUsers();
      if (res.success && res.users) {
        setUsers(res.users);
        const current = res.users.find(u => u.id === currentUser.id);
        if (current) setCurrentUser(current);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const loadItems = async () => {
    setIsLoadingItems(true);
    try {
      const res = await apiClient.getItems({
        ...filters,
        search: searchQuery
      }, currentUser.id);

      if (res.success) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const loadPendingCount = async () => {
    try {
      const res = await apiClient.getSwaps(currentUser.id);
      if (res.success) {
        const pending = res.swaps.filter(s => s.status === 'pending');
        setPendingSwapsCount(pending.length);
      }
    } catch (err) {
      console.error('Error counting swaps:', err);
    }
  };

  const handleSwitchUser = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      condition: 'All',
      size: 'All'
    });
    setSearchQuery('');
  };

  const handleItemCreated = (newItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  // Get current user's available wardrobe for proposing swaps
  const userWardrobe = items.filter(i => i.ownerId === currentUser.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      
      {/* Navigation Bar */}
      <Navbar 
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        onOpenCreateListing={() => setIsCreateListingOpen(true)}
        onOpenMySwaps={() => setIsMySwapsOpen(true)}
        onOpenSustainability={() => setIsSustainabilityOpen(true)}
        pendingSwapsCount={pendingSwapsCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section */}
      <HeroBanner 
        onOpenCreateListing={() => setIsCreateListingOpen(true)}
      />

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Category & Filter Bar */}
        <FilterBar 
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
        />

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900">
              {filters.category === 'All' ? 'Curated Wardrobe Feed' : `${filters.category} Collection`}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Browse pre-loved items available for 1-to-1 barter exchange
            </p>
          </div>

          <button
            onClick={loadItems}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of Items */}
        {isLoadingItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-stone-100 rounded-2xl aspect-[4/5] animate-pulse"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8">
            <Shirt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif-display text-lg font-bold text-stone-800">
              No garments found matching filters
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
              Try resetting your category or search filters, or list a new item with AI assistance to kickstart the community!
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                currentUser={currentUser}
                onSelect={(itm) => setSelectedItemForDetail(itm)}
                onProposeSwap={(itm) => setSelectedItemForSwap(itm)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-serif-display font-bold text-stone-900 text-lg">LOOPWEAR</span>
            <span className="text-xs text-stone-400">| Sustainable Circular Fashion Barter</span>
          </div>
          <div className="text-xs text-stone-500 mt-2 sm:mt-0">
            Powered by 3-Pillar AI: Description Generator • Fair Swap Evaluator • Negotiation Assistant
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Item Detail Modal */}
      {selectedItemForDetail && (
        <ItemDetailModal 
          item={selectedItemForDetail}
          currentUser={currentUser}
          onClose={() => setSelectedItemForDetail(null)}
          onProposeSwap={(itm) => {
            setSelectedItemForDetail(null);
            setSelectedItemForSwap(itm);
          }}
        />
      )}

      {/* 2. Create Listing Modal (AI Description Generator) */}
      {isCreateListingOpen && (
        <CreateListingModal 
          currentUser={currentUser}
          onClose={() => setIsCreateListingOpen(false)}
          onItemCreated={handleItemCreated}
        />
      )}

      {/* 3. Swap Proposal Modal (AI Fair Swap Evaluator) */}
      {selectedItemForSwap && (
        <SwapProposalModal 
          requestedItem={selectedItemForSwap}
          currentUser={currentUser}
          userWardrobe={userWardrobe}
          onClose={() => setSelectedItemForSwap(null)}
          onProposalSent={() => {
            loadPendingCount();
            setIsMySwapsOpen(true);
          }}
          onOpenCreateListing={() => setIsCreateListingOpen(true)}
        />
      )}

      {/* 4. My Swaps & Negotiation Chat (AI Negotiation Assistant) */}
      {isMySwapsOpen && (
        <MySwapsModal 
          currentUser={currentUser}
          onClose={() => setIsMySwapsOpen(false)}
          onSwapUpdated={() => {
            loadPendingCount();
            loadItems();
          }}
        />
      )}

      {/* 5. Sustainability Impact Dashboard */}
      {isSustainabilityOpen && (
        <SustainabilityModal 
          currentUser={currentUser}
          onClose={() => setIsSustainabilityOpen(false)}
        />
      )}

    </div>
  );
}
