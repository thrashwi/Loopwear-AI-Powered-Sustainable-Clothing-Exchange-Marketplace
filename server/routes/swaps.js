import express from 'express';
import { swaps, items, users, conversations } from '../data/mockStore.js';
import { evaluateSwapAI } from '../services/aiService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const currentUserId = req.headers['x-user-id'] || 'user_1';

  const userSwaps = swaps
    .filter(s => s.requesterId === currentUserId || s.recipientId === currentUserId)
    .map(s => {
      // Support both bundle array and legacy single item
      const itemIds = Array.isArray(s.offeredItemIds) && s.offeredItemIds.length > 0
        ? s.offeredItemIds
        : (s.offeredItemId ? [s.offeredItemId] : []);

      const offeredItems = items.filter(i => itemIds.includes(i.id));
      const offeredItem = offeredItems[0] || {};
      const requestedItem = items.find(i => i.id === s.requestedItemId) || {};
      const requester = users.find(u => u.id === s.requesterId) || {};
      const recipient = users.find(u => u.id === s.recipientId) || {};
      return {
        ...s,
        offeredItem,
        offeredItems,
        isBundle: offeredItems.length > 1,
        requestedItem,
        requester,
        recipient,
        isOutgoing: s.requesterId === currentUserId
      };
    });

  res.json({ success: true, count: userSwaps.length, swaps: userSwaps });
});

router.post('/', async (req, res) => {
  try {
    const { offeredItemId, offeredItemIds, requestedItemId } = req.body;
    const currentUserId = req.headers['x-user-id'] || 'user_1';

    const itemIds = Array.isArray(offeredItemIds) && offeredItemIds.length > 0
      ? offeredItemIds
      : (offeredItemId ? [offeredItemId] : []);

    const offeredItems = items.filter(i => itemIds.includes(i.id));
    const requestedItem = items.find(i => i.id === requestedItemId);

    if (offeredItems.length === 0 || !requestedItem) {
      return res.status(400).json({ success: false, message: 'Invalid items provided for swap.' });
    }

    const fairnessAssessment = await evaluateSwapAI({ offeredItems, requestedItem });

    const newSwap = {
      id: `swap_${Date.now()}`,
      requesterId: currentUserId,
      recipientId: requestedItem.ownerId,
      offeredItemId: offeredItems[0].id,
      offeredItemIds: offeredItems.map(i => i.id),
      requestedItemId,
      status: 'pending',
      aiFairnessAssessment: fairnessAssessment,
      createdAt: new Date().toISOString()
    };

    swaps.unshift(newSwap);

    const itemsSummary = offeredItems.map(i => i.title).join(' + ');

    const newConv = {
      id: `conv_${newSwap.id}`,
      swapId: newSwap.id,
      participants: [newSwap.requesterId, newSwap.recipientId],
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: 'system',
          senderName: 'Loopwear AI Assistant',
          text: `Swap proposal initiated: [${itemsSummary}] for [${requestedItem.title}]. AI assessment: ${fairnessAssessment.verdict} (${fairnessAssessment.recommendation})`,
          timestamp: new Date().toISOString()
        }
      ]
    };
    conversations.push(newConv);

    res.status(201).json({
      success: true,
      swap: newSwap,
      conversationId: newConv.id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const swap = swaps.find(s => s.id === req.params.id);

  if (!swap) {
    return res.status(404).json({ success: false, message: 'Swap not found' });
  }

  swap.status = status;

  if (status === 'completed') {
    const itemIds = Array.isArray(swap.offeredItemIds) && swap.offeredItemIds.length > 0
      ? swap.offeredItemIds
      : [swap.offeredItemId];

    items.forEach(i => {
      if (itemIds.includes(i.id) || i.id === swap.requestedItemId) {
        i.status = 'swapped';
      }
    });

    const u1 = users.find(u => u.id === swap.requesterId);
    const u2 = users.find(u => u.id === swap.recipientId);
    const count = itemIds.length + 1;

    if (u1 && u1.sustainabilityScore) {
      u1.swapsCompleted += 1;
      u1.sustainabilityScore.co2KgSaved += count * 3.5;
      u1.sustainabilityScore.waterLitersSaved += count * 1800;
      u1.sustainabilityScore.garmentsDiverted += count;
    }
    if (u2 && u2.sustainabilityScore) {
      u2.swapsCompleted += 1;
      u2.sustainabilityScore.co2KgSaved += count * 3.5;
      u2.sustainabilityScore.waterLitersSaved += count * 1800;
      u2.sustainabilityScore.garmentsDiverted += count;
    }
  }

  res.json({ success: true, swap });
});

export default router;
