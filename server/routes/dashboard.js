import express from 'express';
import { db } from '../data/db.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const user = db.findUserById(currentUserId) || db.getUsers()[0];

  const allItems = db.getItems();
  const allSwaps = db.getSwaps();
  const allConversations = db.getConversations();

  // User's listings
  const myListings = allItems.filter(i => i.ownerId === user.id);
  const activeListings = myListings.filter(i => i.status === 'available');

  // Swaps involving user
  const incomingSwaps = allSwaps.filter(s => s.recipientId === user.id);
  const outgoingSwaps = allSwaps.filter(s => s.requesterId === user.id);
  const userSwaps = allSwaps.filter(s => s.requesterId === user.id || s.recipientId === user.id);

  const pendingSwaps = userSwaps.filter(s => s.status === 'pending');
  const completedSwaps = userSwaps.filter(s => s.status === 'completed');

  // Sustainability impact
  const sustainabilityImpact = user.sustainabilityScore || {
    co2KgSaved: completedSwaps.length * 3.5,
    waterLitersSaved: completedSwaps.length * 1800,
    garmentsDiverted: completedSwaps.length * 2
  };

  // Recent swap activity (with expanded items & user details)
  const recentSwaps = userSwaps.slice(0, 5).map(s => {
    const requestedItem = allItems.find(i => i.id === s.requestedItemId);
    const offeredItemIds = Array.isArray(s.offeredItemIds) ? s.offeredItemIds : [s.offeredItemId];
    const offeredItems = allItems.filter(i => offeredItemIds.includes(i.id));
    const partnerId = s.requesterId === user.id ? s.recipientId : s.requesterId;
    const partner = db.findUserById(partnerId);

    return {
      ...s,
      isOutgoing: s.requesterId === user.id,
      requestedItem,
      offeredItems,
      partner: partner ? { name: partner.name, avatar: partner.avatar, location: partner.location } : null
    };
  });

  // Recent messages for user
  const userConversations = allConversations
    .filter(c => c.participants.includes(user.id))
    .slice(0, 5)
    .map(c => {
      const lastMsg = c.messages[c.messages.length - 1];
      const partnerId = c.participants.find(p => p !== user.id);
      const partner = db.findUserById(partnerId);
      return {
        id: c.id,
        swapId: c.swapId,
        partner: partner ? { name: partner.name, avatar: partner.avatar } : null,
        lastMessage: lastMsg || null,
        unreadCount: c.messages.filter(m => m.senderId !== user.id && !m.read).length
      };
    });

  // Recommended / nearby clothing listings
  const userCity = (user.location || '').split(',').pop().trim().toLowerCase();
  const otherItems = allItems.filter(i => i.ownerId !== user.id && i.status === 'available');
  
  // Sort items matching user's city/locality first
  const nearbyItems = [...otherItems].sort((a, b) => {
    const aLoc = (a.location || '').toLowerCase();
    const bLoc = (b.location || '').toLowerCase();
    const aMatch = aLoc.includes(userCity) ? 1 : 0;
    const bMatch = bLoc.includes(userCity) ? 1 : 0;
    return bMatch - aMatch;
  }).slice(0, 6);

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      location: user.location,
      rating: user.rating,
      swapsCompleted: user.swapsCompleted
    },
    metrics: {
      totalListings: myListings.length,
      activeListings: activeListings.length,
      incomingRequests: incomingSwaps.length,
      outgoingRequests: outgoingSwaps.length,
      pendingRequests: pendingSwaps.length,
      completedSwaps: completedSwaps.length,
      sustainability: sustainabilityImpact
    },
    myListings: myListings.slice(0, 6),
    recentSwaps,
    recentMessages: userConversations,
    nearbyItems
  });
});

export default router;
