import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ListingsPage from './pages/ListingsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import MyListingsPage from './pages/MyListingsPage';
import SwapsPage from './pages/SwapsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Interactive Overlay Modals (for seamless instant usage from any page)
import CreateListingModal from './components/CreateListingModal';
import SwapProposalModal from './components/SwapProposalModal';
import SustainabilityModal from './components/SustainabilityModal';
import ItemDetailModal from './components/ItemDetailModal';

import { AuthProvider, useAuth } from './context/AuthContext';
import { apiClient } from './api';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-stone-400">Loading Loopwear...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Admin-Only Protected Route Wrapper
function AdminRoute({ children }) {
  const { currentUser, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-stone-400">Verifying privileges...</div>;
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function MainAppLayout() {
  const { currentUser } = useAuth();

  // Modals state
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isSustainabilityOpen, setIsSustainabilityOpen] = useState(false);
  const [selectedItemForSwap, setSelectedItemForSwap] = useState(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);

  // User wardrobe for swap proposals
  const [userWardrobe, setUserWardrobe] = useState([]);
  const [pendingSwapsCount, setPendingSwapsCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    async function loadUserData() {
      try {
        const [itemsRes, swapsRes] = await Promise.all([
          apiClient.getMyItems(currentUser.id),
          apiClient.getSwaps(currentUser.id)
        ]);

        if (itemsRes.success) setUserWardrobe(itemsRes.items || []);
        if (swapsRes.success) {
          const pending = (swapsRes.swaps || []).filter(s => s.status === 'pending');
          setPendingSwapsCount(pending.length);
        }
      } catch (err) {
        console.warn('Load user data warning:', err);
      }
    }
    loadUserData();
  }, [currentUser?.id]);

  const handleOpenSwapProposal = (item) => {
    setSelectedItemForSwap(item);
  };

  const handleItemCreated = (newItem) => {
    setUserWardrobe(prev => [newItem, ...prev]);
    setIsCreateListingOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      {/* Top Navbar */}
      <Navbar
        onOpenCreateListing={() => setIsCreateListingOpen(true)}
        onOpenSustainability={() => setIsSustainabilityOpen(true)}
        pendingSwapsCount={pendingSwapsCount}
      />

      {/* Main Multi-Page Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <LandingPage 
              onOpenCreateListing={() => setIsCreateListingOpen(true)}
              onOpenSustainability={() => setIsSustainabilityOpen(true)}
            />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage 
                onOpenCreateListing={() => setIsCreateListingOpen(true)}
                onOpenSustainability={() => setIsSustainabilityOpen(true)}
              />
            </ProtectedRoute>
          } />

          <Route path="/listings" element={
            <ListingsPage 
              onProposeSwap={handleOpenSwapProposal}
            />
          } />

          <Route path="/listings/:id" element={
            <ItemDetailPage 
              onProposeSwap={handleOpenSwapProposal}
            />
          } />

          <Route path="/create-listing" element={
            <ProtectedRoute>
              <CreateListingPage onItemCreated={handleItemCreated} />
            </ProtectedRoute>
          } />

          <Route path="/my-listings" element={
            <ProtectedRoute>
              <MyListingsPage onOpenCreateListing={() => setIsCreateListingOpen(true)} />
            </ProtectedRoute>
          } />

          <Route path="/swaps" element={
            <ProtectedRoute>
              <SwapsPage />
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          <Route path="/chat/:conversationId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlay Modals */}
      {isCreateListingOpen && (
        <CreateListingModal
          currentUser={currentUser || { id: 'user_1', name: 'User' }}
          onClose={() => setIsCreateListingOpen(false)}
          onItemCreated={handleItemCreated}
        />
      )}

      {selectedItemForSwap && (
        <SwapProposalModal
          requestedItem={selectedItemForSwap}
          currentUser={currentUser || { id: 'user_1', name: 'User' }}
          userWardrobe={userWardrobe}
          onClose={() => setSelectedItemForSwap(null)}
          onProposalSent={() => {
            setSelectedItemForSwap(null);
          }}
          onOpenCreateListing={() => {
            setSelectedItemForSwap(null);
            setIsCreateListingOpen(true);
          }}
        />
      )}

      {isSustainabilityOpen && (
        <SustainabilityModal
          currentUser={currentUser || { id: 'user_1', name: 'User' }}
          onClose={() => setIsSustainabilityOpen(false)}
        />
      )}

      {selectedItemForDetail && (
        <ItemDetailModal
          item={selectedItemForDetail}
          currentUser={currentUser || { id: 'user_1', name: 'User' }}
          onClose={() => setSelectedItemForDetail(null)}
          onProposeSwap={(item) => {
            setSelectedItemForDetail(null);
            setSelectedItemForSwap(item);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainAppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
