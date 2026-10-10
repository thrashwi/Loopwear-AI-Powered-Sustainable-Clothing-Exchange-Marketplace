import express from 'express';
import { db } from '../data/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 1. Get all conversations for current user
router.get('/', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const allConversations = db.getConversations();
  const allItems = db.getItems();
  const allSwaps = db.getSwaps();

  const userConversations = allConversations
    .filter(c => c.participants.includes(currentUserId))
    .map(c => {
      const partnerId = c.participants.find(p => p !== currentUserId) || c.participants[0];
      const partner = db.findUserById(partnerId);
      const swap = allSwaps.find(s => s.id === c.swapId);
      let swapContext = null;

      if (swap) {
        const reqItem = allItems.find(i => i.id === swap.requestedItemId);
        const offItem = allItems.find(i => i.id === (swap.offeredItemId || (swap.offeredItemIds && swap.offeredItemIds[0])));
        swapContext = {
          swapId: swap.id,
          status: swap.status,
          requestedTitle: reqItem ? reqItem.title : 'Item',
          offeredTitle: offItem ? offItem.title : 'Item'
        };
      }

      return {
        id: c.id,
        swapId: c.swapId,
        partner: partner ? {
          id: partner.id,
          name: partner.name,
          avatar: partner.avatar,
          location: partner.location
        } : { id: 'unknown', name: 'User' },
        swapContext,
        lastMessage: c.messages[c.messages.length - 1] || null,
        unreadCount: c.messages.filter(m => m.senderId !== currentUserId && !m.read).length,
        updatedAt: c.messages.length > 0 ? c.messages[c.messages.length - 1].timestamp : c.createdAt
      };
    });

  res.json({ success: true, count: userConversations.length, conversations: userConversations });
});

// 2. Get conversation messages by swapId or conversationId
router.get('/:id', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const { id } = req.params;

  let conv = db.findConversationById(id) || db.findConversationBySwapId(id);

  if (!conv) {
    // Check if swap exists and initialize
    const swap = db.findSwapById(id);
    conv = db.createConversation({
      id: `conv_${id}`,
      swapId: id,
      participants: swap ? [swap.requesterId, swap.recipientId] : [currentUserId],
      messages: []
    });
  }

  // Ensure current user is in participants or is admin
  const isAdmin = req.user && req.user.role === 'admin';
  if (!conv.participants.includes(currentUserId) && !isAdmin) {
    // Add user if they are party to the swap
    const swap = db.findSwapById(conv.swapId);
    if (swap && (swap.requesterId === currentUserId || swap.recipientId === currentUserId)) {
      conv.participants.push(currentUserId);
      db.saveData();
    } else if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'You are not an authorized participant in this conversation.' });
    }
  }

  // Mark messages as read for current user
  let updatedAny = false;
  conv.messages.forEach(m => {
    if (m.senderId !== currentUserId && !m.read) {
      m.read = true;
      updatedAny = true;
    }
  });
  if (updatedAny) db.saveData();

  // Populate swap details
  const swap = db.findSwapById(conv.swapId);
  let swapDetails = null;
  if (swap) {
    const allItems = db.getItems();
    const offeredIds = Array.isArray(swap.offeredItemIds) ? swap.offeredItemIds : [swap.offeredItemId];
    swapDetails = {
      ...swap,
      offeredItem: allItems.find(i => i.id === swap.offeredItemId),
      offeredItems: allItems.filter(i => offeredIds.includes(i.id)),
      requestedItem: allItems.find(i => i.id === swap.requestedItemId)
    };
  }

  const partnerId = conv.participants.find(p => p !== currentUserId) || conv.participants[0];
  const partner = db.findUserById(partnerId);

  res.json({
    success: true,
    conversation: conv,
    partner: partner ? { id: partner.id, name: partner.name, avatar: partner.avatar, location: partner.location } : null,
    swap: swapDetails
  });
});

// 3. Post message to conversation or swap
router.post('/:id/messages', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const currentUser = db.findUserById(currentUserId) || { name: 'User' };
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
  }

  const { conv, message } = db.addMessage(id, {
    senderId: currentUserId,
    senderName: currentUser.name,
    text: text.trim()
  });

  res.status(201).json({ success: true, message, conversationId: conv.id });
});

export default router;
