import express from 'express';
import { 
  generateListingAI, 
  evaluateSwapAI, 
  generateChatSuggestionsAI,
  classifyImageAI,
  calculateSustainabilityAI
} from '../services/aiService.js';
import { items } from '../data/mockStore.js';

const router = express.Router();

/**
 * 1. AI Clothing Description & Valuation Generator
 */
router.post('/generate-description', async (req, res) => {
  try {
    const { brand, category, size, condition, color, rawNotes } = req.body;
    const aiResult = await generateListingAI({ brand, category, size, condition, color, rawNotes });
    res.json({ success: true, ...aiResult });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 2. AI Fair Swap Evaluator (with Multi-Item Bundle Support)
 */
router.post('/evaluate-swap', async (req, res) => {
  try {
    const { 
      offeredItem, 
      offeredItems, 
      requestedItem, 
      offeredItemId, 
      offeredItemIds, 
      requestedItemId 
    } = req.body;

    // Resolve requested item
    const reqItem = requestedItem || items.find(i => i.id === requestedItemId);

    // Resolve offered items (bundle support)
    let offItems = [];
    if (Array.isArray(offeredItems) && offeredItems.length > 0) {
      offItems = offeredItems;
    } else if (Array.isArray(offeredItemIds) && offeredItemIds.length > 0) {
      offItems = items.filter(i => offeredItemIds.includes(i.id));
    } else if (offeredItem) {
      offItems = [offeredItem];
    } else if (offeredItemId) {
      const found = items.find(i => i.id === offeredItemId);
      if (found) offItems = [found];
    }

    if (offItems.length === 0 || !reqItem) {
      return res.status(400).json({ success: false, message: 'Both offered item(s) and requested item are required.' });
    }

    const evaluation = await evaluateSwapAI({ offeredItems: offItems, requestedItem: reqItem });
    res.json({ success: true, ...evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 3. AI Negotiation & Counteroffer Assistant
 */
router.post('/suggest-counteroffer', async (req, res) => {
  try {
    const { userRole, offeredTitle, requestedTitle, differenceAmount, verdict } = req.body;
    const suggestions = await generateChatSuggestionsAI({
      userRole: userRole || 'requester',
      offeredTitle: offeredTitle || 'Your item',
      requestedTitle: requestedTitle || 'Their item',
      differenceAmount: differenceAmount || 0,
      verdict: verdict || 'Fair Swap'
    });
    res.json({ success: true, ...suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 4. AI Image-Based Clothing Classifier
 */
router.post('/classify-image', async (req, res) => {
  try {
    const { imageUrl, userHint } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL or data is required' });
    }
    const classification = await classifyImageAI({ imageUrl, userHint });
    res.json({ success: true, ...classification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 5. AI Sustainability Calculator & Advisor
 */
router.post('/sustainability-calc', async (req, res) => {
  try {
    const { garmentType, material, timesWorn } = req.body;
    const calculation = await calculateSustainabilityAI({ garmentType, material, timesWorn });
    res.json({ success: true, ...calculation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
