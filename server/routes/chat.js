import express from 'express';
import { conversations, swaps, items, users } from '../data/mockStore.js';

const router = express.Router();

router.get('/:swapId', (req, res) => {
  const { swapId } = req.params;
  let conv = conversations.find(c => c.swapId === swapId || c.id === swapId);

  if (!conv) {
    conv = {
      id: `conv_${swapId}`,
      swapId,
      participants: [],
      messages: []
    };
    conversations.push(conv);
  }

  const swap = swaps.find(s => s.id === swapId);
  let swapDetails = null;
  if (swap) {
    swapDetails = {
      ...swap,
      offeredItem: items.find(i => i.id === swap.offeredItemId),
      requestedItem: items.find(i => i.id === swap.requestedItemId)
    };
  }

  res.json({ success: true, conversation: conv, swap: swapDetails });
});

router.post('/:swapId/messages', (req, res) => {
  const { swapId } = req.params;
  const { text } = req.body;
  const currentUserId = req.headers['x-user-id'] || 'user_1';
  const currentUser = users.find(u => u.id === currentUserId) || { name: 'User' };

  let conv = conversations.find(c => c.swapId === swapId || c.id === swapId);
  if (!conv) {
    conv = { id: `conv_${swapId}`, swapId, participants: [currentUserId], messages: [] };
    conversations.push(conv);
  }

  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: currentUserId,
    senderName: currentUser.name,
    text,
    timestamp: new Date().toISOString()
  };

  conv.messages.push(newMsg);
  res.status(201).json({ success: true, message: newMsg });
});

export default router;
