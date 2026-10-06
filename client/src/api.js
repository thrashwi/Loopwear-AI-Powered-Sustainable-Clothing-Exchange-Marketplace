// Centralized API Client for Loopwear

const API_BASE = '/api';

export const apiClient = {
  // --- Auth / Users ---
  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  async login(userId) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async getMe(userId) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'x-user-id': userId }
    });
    return res.json();
  },

  // --- Items ---
  async getItems(filters = {}, currentUserId) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.size && filters.size !== 'All') params.append('size', filters.size);
    if (filters.condition && filters.condition !== 'All') params.append('condition', filters.condition);
    if (filters.search) params.append('search', filters.search);
    if (filters.ownerId) params.append('ownerId', filters.ownerId);
    if (filters.excludeOwner) params.append('excludeOwner', filters.excludeOwner);

    const res = await fetch(`${API_BASE}/items?${params.toString()}`, {
      headers: { 'x-user-id': currentUserId || 'user_1' }
    });
    return res.json();
  },

  async getItem(id) {
    const res = await fetch(`${API_BASE}/items/${id}`);
    return res.json();
  },

  async createItem(itemData, currentUserId) {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUserId
      },
      body: JSON.stringify(itemData)
    });
    return res.json();
  },

  // --- Swaps ---
  async getSwaps(currentUserId) {
    const res = await fetch(`${API_BASE}/swaps`, {
      headers: { 'x-user-id': currentUserId }
    });
    return res.json();
  },

  async createSwapProposal(offeredItemIds, requestedItemId, currentUserId) {
    const ids = Array.isArray(offeredItemIds) ? offeredItemIds : [offeredItemIds];
    const res = await fetch(`${API_BASE}/swaps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUserId
      },
      body: JSON.stringify({ 
        offeredItemIds: ids,
        offeredItemId: ids[0],
        requestedItemId 
      })
    });
    return res.json();
  },

  async updateSwapStatus(swapId, status, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUserId
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // --- AI Endpoints ---
  // 1. AI Description & Valuation Generator
  async generateAIDescription(clothingDetails) {
    const res = await fetch(`${API_BASE}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clothingDetails)
    });
    return res.json();
  },

  // 2. AI Fair Swap Evaluator (supports array of items or single item)
  async evaluateSwapAI(offeredItems, requestedItem) {
    const items = Array.isArray(offeredItems) ? offeredItems : [offeredItems];
    const res = await fetch(`${API_BASE}/ai/evaluate-swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        offeredItems: items,
        offeredItem: items[0],
        requestedItem 
      })
    });
    return res.json();
  },

  // 3. AI Negotiation Suggestions
  async getChatSuggestionsAI({ userRole, offeredTitle, requestedTitle, differenceAmount, verdict }) {
    const res = await fetch(`${API_BASE}/ai/suggest-counteroffer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userRole, offeredTitle, requestedTitle, differenceAmount, verdict })
    });
    return res.json();
  },

  // 4. AI Image Classifier
  async classifyImageAI(imageUrl, userHint) {
    const res = await fetch(`${API_BASE}/ai/classify-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, userHint })
    });
    return res.json();
  },

  // 5. AI Sustainability Calculator
  async calculateSustainabilityAI(details) {
    const res = await fetch(`${API_BASE}/ai/sustainability-calc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return res.json();
  },

  // --- Chat ---
  async getConversation(swapId) {
    const res = await fetch(`${API_BASE}/chat/${swapId}`);
    return res.json();
  },

  async sendMessage(swapId, text, currentUserId) {
    const res = await fetch(`${API_BASE}/chat/${swapId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUserId
      },
      body: JSON.stringify({ text })
    });
    return res.json();
  }
};
