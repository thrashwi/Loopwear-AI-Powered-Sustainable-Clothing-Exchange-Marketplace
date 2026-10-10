// Centralized API Client for Loopwear
// Supports environment base URL for production deployment & local proxy

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeaders(overrideUserId) {
  const token = localStorage.getItem('loopwear_token');
  const userId = overrideUserId || localStorage.getItem('loopwear_userId') || 'user_1';
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (userId) {
    headers['x-user-id'] = userId;
  }
  return headers;
}

export const apiClient = {
  // --- Auth / Users ---
  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  async login(credentials) {
    // Supports either { identifier, password } or legacy userId
    const body = typeof credentials === 'string' 
      ? { userId: credentials } 
      : (credentials.userId && !credentials.password ? { userId: credentials.userId } : credentials);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getMe(userId) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(userId)
    });
    return res.json();
  },

  // --- Dashboard ---
  async getDashboard(userId) {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders(userId)
    });
    return res.json();
  },

  // --- Profile ---
  async getProfile(userId) {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getAuthHeaders(userId)
    });
    return res.json();
  },

  async updateProfile(profileData, userId) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(userId),
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  // --- Items / Clothing Listings ---
  async getItems(filters = {}, currentUserId) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.size && filters.size !== 'All') params.append('size', filters.size);
    if (filters.condition && filters.condition !== 'All') params.append('condition', filters.condition);
    if (filters.brand && filters.brand !== 'All') params.append('brand', filters.brand);
    if (filters.minVal) params.append('minVal', filters.minVal);
    if (filters.maxVal) params.append('maxVal', filters.maxVal);
    if (filters.location && filters.location !== 'All') params.append('location', filters.location);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.status) params.append('status', filters.status);
    if (filters.ownerId) params.append('ownerId', filters.ownerId);
    if (filters.excludeOwner) params.append('excludeOwner', filters.excludeOwner);

    const res = await fetch(`${API_BASE}/items?${params.toString()}`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async getItem(id) {
    const res = await fetch(`${API_BASE}/items/${id}`);
    return res.json();
  },

  async getMyItems(currentUserId) {
    const res = await fetch(`${API_BASE}/items/mine`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async createItem(itemData, currentUserId) {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify(itemData)
    });
    return res.json();
  },

  async updateItem(id, itemData, currentUserId) {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify(itemData)
    });
    return res.json();
  },

  async deleteItem(id, currentUserId) {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async uploadImage(file, currentUserId) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('loopwear_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (currentUserId) headers['x-user-id'] = currentUserId;

    const res = await fetch(`${API_BASE}/items/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    return res.json();
  },

  // --- Swaps Lifecycle ---
  async getSwaps(currentUserId) {
    const res = await fetch(`${API_BASE}/swaps`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async getIncomingSwaps(currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/incoming`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async getOutgoingSwaps(currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/outgoing`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async getSwap(id, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${id}`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async createSwapProposal(offeredItemIds, requestedItemId, currentUserId, message = '') {
    const ids = Array.isArray(offeredItemIds) ? offeredItemIds : [offeredItemIds];
    const res = await fetch(`${API_BASE}/swaps`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify({ 
        offeredItemIds: ids,
        offeredItemId: ids[0],
        requestedItemId,
        message
      })
    });
    return res.json();
  },

  async acceptSwap(swapId, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async rejectSwap(swapId, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async cancelSwap(swapId, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async counterofferSwap(swapId, counterData, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/counteroffer`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify(counterData)
    });
    return res.json();
  },

  async completeSwap(swapId, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async updateSwapStatus(swapId, status, currentUserId) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // --- Conversations & Chat ---
  async getConversations(currentUserId) {
    const res = await fetch(`${API_BASE}/chat`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async getConversation(swapIdOrConvId, currentUserId) {
    const res = await fetch(`${API_BASE}/chat/${swapIdOrConvId}`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async sendMessage(swapIdOrConvId, text, currentUserId) {
    const res = await fetch(`${API_BASE}/chat/${swapIdOrConvId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  // --- Reports ---
  async submitReport(reportData, currentUserId) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify(reportData)
    });
    return res.json();
  },

  // --- Admin API ---
  async getAdminAnalytics(currentUserId) {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async getAdminUsers(currentUserId) {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async updateAdminUserStatus(userId, status, currentUserId) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async getAdminListings(currentUserId) {
    const res = await fetch(`${API_BASE}/admin/listings`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async deleteAdminListing(itemId, currentUserId) {
    const res = await fetch(`${API_BASE}/admin/listings/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async getAdminReports(currentUserId) {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getAuthHeaders(currentUserId)
    });
    return res.json();
  },

  async updateAdminReport(reportId, reportData, currentUserId) {
    const res = await fetch(`${API_BASE}/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: getAuthHeaders(currentUserId),
      body: JSON.stringify(reportData)
    });
    return res.json();
  },

  // --- AI Endpoints ---
  async generateAIDescription(clothingDetails) {
    const res = await fetch(`${API_BASE}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clothingDetails)
    });
    return res.json();
  },

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

  async getChatSuggestionsAI({ userRole, offeredTitle, requestedTitle, differenceAmount, verdict }) {
    const res = await fetch(`${API_BASE}/ai/suggest-counteroffer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userRole, offeredTitle, requestedTitle, differenceAmount, verdict })
    });
    return res.json();
  },

  async classifyImageAI(imageUrl, userHint) {
    const res = await fetch(`${API_BASE}/ai/classify-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, userHint })
    });
    return res.json();
  },

  async calculateSustainabilityAI(details) {
    const res = await fetch(`${API_BASE}/ai/sustainability-calc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return res.json();
  }
};
