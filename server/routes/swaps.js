import express from 'express';
import { db } from '../data/db.js';
import { evaluateSwapAI } from '../services/aiService.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = express.Router();

function hydrateSwap(swap, currentUserId) {
  const allItems = db.getItems();
  const allUsers = db.getUsers();

  const itemIds = Array.isArray(swap.offeredItemIds) && swap.offeredItemIds.length > 0
    ? swap.offeredItemIds
    : (swap.offeredItemId ? [swap.offeredItemId] : []);

  const offeredItems = allItems.filter(i => itemIds.includes(i.id));
  const offeredItem = offeredItems[0] || null;
  const requestedItem = allItems.find(i => i.id === swap.requestedItemId) || null;
  const requester = allUsers.find(u => u.id === swap.requesterId) || null;
  const recipient = allUsers.find(u => u.id === swap.recipientId) || null;

  return {
    ...swap,
    offeredItem,
    offeredItems,
    isBundle: offeredItems.length > 1,
    requestedItem,
    requester: requester ? { id: requester.id, name: requester.name, avatar: requester.avatar, location: requester.location } : null,
    recipient: recipient ? { id: recipient.id, name: recipient.name, avatar: recipient.avatar, location: recipient.location } : null,
    isOutgoing: swap.requesterId === currentUserId,
    isIncoming: swap.recipientId === currentUserId
  };
}

// 1. Get all swaps for current user
router.get('/', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const userSwaps = db.getSwaps()
    .filter(s => s.requesterId === currentUserId || s.recipientId === currentUserId)
    .map(s => hydrateSwap(s, currentUserId));

  res.json({ success: true, count: userSwaps.length, swaps: userSwaps });
});

// 2. Get incoming swap requests
router.get('/incoming', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const incoming = db.getSwaps()
    .filter(s => s.recipientId === currentUserId)
    .map(s => hydrateSwap(s, currentUserId));

  res.json({ success: true, count: incoming.length, swaps: incoming });
});

// 3. Get outgoing swap requests
router.get('/outgoing', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const outgoing = db.getSwaps()
    .filter(s => s.requesterId === currentUserId)
    .map(s => hydrateSwap(s, currentUserId));

  res.json({ success: true, count: outgoing.length, swaps: outgoing });
});

// 4. Get single swap by ID
router.get('/:id', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const swap = db.findSwapById(req.params.id);
  if (!swap) {
    return res.status(404).json({ success: false, message: 'Swap request not found.' });
  }

  res.json({ success: true, swap: hydrateSwap(swap, currentUserId) });
});

// 5. Submit new swap proposal
router.post('/', authenticate, async (req, res) => {
  try {
    const { offeredItemId, offeredItemIds, requestedItemId, message } = req.body;
    const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');

    const itemIds = Array.isArray(offeredItemIds) && offeredItemIds.length > 0
      ? offeredItemIds
      : (offeredItemId ? [offeredItemId] : []);

    if (itemIds.length === 0 || !requestedItemId) {
      return res.status(400).json({ success: false, message: 'Both offered items and requested item are required.' });
    }

    const requestedItem = db.findItemById(requestedItemId);
    if (!requestedItem) {
      return res.status(404).json({ success: false, message: 'Requested clothing item was not found.' });
    }

    // Prevent swapping with oneself
    if (requestedItem.ownerId === currentUserId) {
      return res.status(400).json({ success: false, message: 'You cannot propose a swap on your own listing.' });
    }

    // Check availability of requested item
    if (requestedItem.status !== 'available') {
      return res.status(400).json({ success: false, message: `The item "${requestedItem.title}" is currently ${requestedItem.status} and cannot be swapped.` });
    }

    // Verify ownership and availability of offered items
    const offeredItems = [];
    for (const id of itemIds) {
      const itm = db.findItemById(id);
      if (!itm) {
        return res.status(404).json({ success: false, message: `Offered item ID ${id} not found.` });
      }
      if (itm.ownerId !== currentUserId) {
        return res.status(403).json({ success: false, message: `You can only offer items you personally own.` });
      }
      if (itm.status !== 'available') {
        return res.status(400).json({ success: false, message: `Offered item "${itm.title}" is ${itm.status} and cannot be offered.` });
      }
      offeredItems.push(itm);
    }

    // AI Fair Swap Assessment
    const fairnessAssessment = await evaluateSwapAI({ offeredItems, requestedItem });

    const newSwap = db.createSwap({
      requesterId: currentUserId,
      recipientId: requestedItem.ownerId,
      requestedItemId,
      offeredItemId: offeredItems[0].id,
      offeredItemIds: offeredItems.map(i => i.id),
      status: 'pending',
      aiFairnessAssessment: fairnessAssessment,
      message: message || 'Hello! I would love to trade clothes with you.'
    });

    const itemsSummary = offeredItems.map(i => i.title).join(' + ');

    // Initialize linked negotiation conversation
    const newConv = db.createConversation({
      id: `conv_${newSwap.id}`,
      swapId: newSwap.id,
      participants: [newSwap.requesterId, newSwap.recipientId],
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: 'system',
          senderName: 'Loopwear AI Assistant',
          text: `Swap proposal initiated: [${itemsSummary}] for [${requestedItem.title}]. AI assessment: ${fairnessAssessment.verdict} (${fairnessAssessment.recommendation})`,
          timestamp: new Date().toISOString(),
          read: true
        }
      ]
    });

    if (message && message.trim()) {
      const currentUser = db.findUserById(currentUserId);
      db.addMessage(newConv.id, {
        senderId: currentUserId,
        senderName: currentUser ? currentUser.name : 'Requester',
        text: message.trim()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Swap proposal sent successfully!',
      swap: hydrateSwap(newSwap, currentUserId),
      conversationId: newConv.id
    });
  } catch (err) {
    console.error('[Create Swap Error]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Accept Swap
router.post('/:id/accept', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const swap = db.findSwapById(req.params.id);

  if (!swap) {
    return res.status(404).json({ success: false, message: 'Swap not found.' });
  }

  if (swap.recipientId !== currentUserId) {
    return res.status(403).json({ success: false, message: 'Only the recipient of this offer can accept it.' });
  }

  if (swap.status !== 'pending' && swap.status !== 'counteroffered') {
    return res.status(400).json({ success: false, message: `Cannot accept a swap in ${swap.status} state.` });
  }

  // Reserve items so they cannot be committed to conflicting swaps
  const itemIds = Array.isArray(swap.offeredItemIds) ? swap.offeredItemIds : [swap.offeredItemId];
  itemIds.forEach(id => db.updateItem(id, { status: 'reserved' }));
  db.updateItem(swap.requestedItemId, { status: 'reserved' });

  // Update swap status
  const updated = db.updateSwap(swap.id, { status: 'accepted' });

  // Post system notice to conversation
  db.addMessage(swap.id, {
    senderId: 'system',
    senderName: 'Loopwear System',
    text: '🎉 Swap proposal accepted! Both items are now reserved. You can coordinate handover details in this chat and mark the exchange completed when done.'
  });

  res.json({
    success: true,
    message: 'Swap proposal accepted! Items are reserved.',
    swap: hydrateSwap(updated, currentUserId)
  });
});

// 7. Reject Swap
router.post('/:id/reject', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const swap = db.findSwapById(req.params.id);

  if (!swap) {
    return res.status(404).json({ success: false, message: 'Swap not found.' });
  }

  if (swap.recipientId !== currentUserId) {
    return res.status(403).json({ success: false, message: 'Only the recipient can reject this swap offer.' });
  }

  const updated = db.updateSwap(swap.id, { status: 'rejected' });

  db.addMessage(swap.id, {
    senderId: 'system',
    senderName: 'Loopwear System',
    text: 'The swap proposal was declined.'
  });

  res.json({
    success: true,
    message: 'Swap proposal declined.',
    swap: hydrateSwap(updated, currentUserId)
  });
});

// 8. Cancel Swap (Requester only)
router.post('/:id/cancel', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const swap = db.findSwapById(req.params.id);

  if (!swap) {
    return res.status(404).json({ success: false, message: 'Swap not found.' });
  }

  if (swap.requesterId !== currentUserId) {
    return res.status(403).json({ success: false, message: 'Only the requester can cancel this swap offer.' });
  }

  if (swap.status === 'completed') {
    return res.status(400).json({ success: false, message: 'Completed swaps cannot be cancelled.' });
  }

  // Release any reserved items if was accepted
  if (swap.status === 'accepted') {
    const itemIds = Array.isArray(swap.offeredItemIds) ? swap.offeredItemIds : [swap.offeredItemId];
    itemIds.forEach(id => db.updateItem(id, { status: 'available' }));
    db.updateItem(swap.requestedItemId, { status: 'available' });
  }

  const updated = db.updateSwap(swap.id, { status: 'cancelled' });

  db.addMessage(swap.id, {
    senderId: 'system',
    senderName: 'Loopwear System',
    text: 'The swap offer was cancelled by the requester.'
  });

  res.json({
    success: true,
    message: 'Swap offer cancelled.',
    swap: hydrateSwap(updated, currentUserId)
  });
});

// 9. Propose Counteroffer
router.post('/:id/counteroffer', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const swap = db.findSwapById(req.params.id);

  if (!swap) {
    return res.status(404).json({ success: false, message: 'Swap not found.' });
  }

  const { counterOfferMessage, newOfferedItemIds } = req.body;

  const history = swap.counterofferHistory || [];
  history.push({
    proposedBy: currentUserId,
    timestamp: new Date().toISOString(),
    message: counterOfferMessage || 'Counteroffer suggested',
    itemIds: newOfferedItemIds || swap.offeredItemIds
  });

  const updates = {
    status: 'counteroffered',
    counterofferHistory: history
  };

  if (Array.isArray(newOfferedItemIds) && newOfferedItemIds.length > 0) {
    updates.offeredItemIds = newOfferedItemIds;
    updates.offeredItemId = newOfferedItemIds[0];
  }

  const updated = db.updateSwap(swap.id, updates);

  db.addMessage(swap.id, {
    senderId: currentUserId,
    senderName: req.user ? req.user.name : 'Counteroffer',
    text: `Counteroffer proposed: "${counterOfferMessage || 'Let us adjust the terms of this exchange.'}"`
  });

  res.json({
    success: true,
    message: 'Counteroffer sent successfully!',
    swap: hydrateSwap(updated, currentUserId)
  });
});

// 10. Mark Swap Completed (Increments sustainability metrics)
router.post('/:id/complete', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const swap = db.findSwapById(req.params.id);

  if (!swap) {
    return res.status(404).json({ success: false, message: 'Swap not found.' });
  }

  if (swap.requesterId !== currentUserId && swap.recipientId !== currentUserId) {
    return res.status(403).json({ success: false, message: 'Only participants of this swap can mark it completed.' });
  }

  // Update swap status
  const updated = db.updateSwap(swap.id, { status: 'completed' });

  // Mark all involved items as 'swapped'
  const itemIds = Array.isArray(swap.offeredItemIds) ? swap.offeredItemIds : [swap.offeredItemId];
  itemIds.forEach(id => db.updateItem(id, { status: 'swapped' }));
  db.updateItem(swap.requestedItemId, { status: 'swapped' });

  // Update sustainability metrics for both users
  const totalGarments = itemIds.length + 1;
  const co2Increment = totalGarments * 3.5;
  const waterIncrement = totalGarments * 1800;

  const u1 = db.findUserById(swap.requesterId);
  const u2 = db.findUserById(swap.recipientId);

  if (u1) {
    const curScore = u1.sustainabilityScore || { co2KgSaved: 0, waterLitersSaved: 0, garmentsDiverted: 0 };
    db.updateUser(u1.id, {
      swapsCompleted: (u1.swapsCompleted || 0) + 1,
      sustainabilityScore: {
        co2KgSaved: Math.round((curScore.co2KgSaved + co2Increment) * 10) / 10,
        waterLitersSaved: Math.round(curScore.waterLitersSaved + waterIncrement),
        garmentsDiverted: (curScore.garmentsDiverted || 0) + totalGarments
      }
    });
  }

  if (u2) {
    const curScore = u2.sustainabilityScore || { co2KgSaved: 0, waterLitersSaved: 0, garmentsDiverted: 0 };
    db.updateUser(u2.id, {
      swapsCompleted: (u2.swapsCompleted || 0) + 1,
      sustainabilityScore: {
        co2KgSaved: Math.round((curScore.co2KgSaved + co2Increment) * 10) / 10,
        waterLitersSaved: Math.round(curScore.waterLitersSaved + waterIncrement),
        garmentsDiverted: (curScore.garmentsDiverted || 0) + totalGarments
      }
    });
  }

  db.addMessage(swap.id, {
    senderId: 'system',
    senderName: 'Loopwear Sustainability Engine',
    text: `🌿 Swap successfully completed! Together, you prevented ${totalGarments} garments from reaching landfills, saving ~${co2Increment.toFixed(1)} kg of CO2 and ~${waterIncrement.toLocaleString()} liters of water!`
  });

  res.json({
    success: true,
    message: 'Congratulations! Exchange successfully marked as completed.',
    swap: hydrateSwap(updated, currentUserId)
  });
});

// Legacy status update endpoint for backward compatibility
router.put('/:id/status', authenticate, (req, res) => {
  const { status } = req.body;
  if (status === 'accepted') return router.handle({ ...req, url: `/${req.params.id}/accept`, method: 'POST' }, res);
  if (status === 'rejected') return router.handle({ ...req, url: `/${req.params.id}/reject`, method: 'POST' }, res);
  if (status === 'completed') return router.handle({ ...req, url: `/${req.params.id}/complete`, method: 'POST' }, res);
  if (status === 'cancelled') return router.handle({ ...req, url: `/${req.params.id}/cancel`, method: 'POST' }, res);

  const swap = db.updateSwap(req.params.id, { status });
  if (!swap) return res.status(404).json({ success: false, message: 'Swap not found' });
  res.json({ success: true, swap });
});

export default router;
