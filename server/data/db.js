import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'store.json');

// Default initial seed data with bcrypt-hashed passwords for test accounts:
// 'Rahul@123', 'Ananya@123', 'Priya@123', 'Admin@12345'
const SALT = bcrypt.genSaltSync(10);
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Rahul@123', SALT);
const ANANYA_PASSWORD_HASH = bcrypt.hashSync('Ananya@123', SALT);
const PRIYA_PASSWORD_HASH = bcrypt.hashSync('Priya@123', SALT);
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Admin@12345', SALT);

const INITIAL_SEED = {
  users: [
    {
      id: 'user_1',
      name: 'Rahul Sharma',
      username: 'rahul_s',
      email: 'rahul@example.com',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      location: 'Indiranagar, Bengaluru',
      rating: 4.9,
      status: 'active',
      swapsCompleted: 12,
      sustainabilityScore: {
        co2KgSaved: 48,
        waterLitersSaved: 15400,
        garmentsDiverted: 14
      },
      createdAt: '2026-08-15T10:00:00.000Z'
    },
    {
      id: 'user_2',
      name: 'Ananya Verma',
      username: 'ananya_v',
      email: 'ananya@example.com',
      passwordHash: ANANYA_PASSWORD_HASH,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      location: 'Koramangala, Bengaluru',
      rating: 5.0,
      status: 'active',
      swapsCompleted: 19,
      sustainabilityScore: {
        co2KgSaved: 76,
        waterLitersSaved: 24200,
        garmentsDiverted: 21
      },
      createdAt: '2026-08-20T11:30:00.000Z'
    },
    {
      id: 'user_3',
      name: 'Priya Patel',
      username: 'priya_p',
      email: 'priya@example.com',
      passwordHash: PRIYA_PASSWORD_HASH,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      location: 'Bandra, Mumbai',
      rating: 4.8,
      status: 'active',
      swapsCompleted: 7,
      sustainabilityScore: {
        co2KgSaved: 28,
        waterLitersSaved: 9800,
        garmentsDiverted: 8
      },
      createdAt: '2026-09-01T09:15:00.000Z'
    },
    {
      id: 'user_admin',
      name: 'Loopwear Administrator',
      username: 'admin',
      email: 'admin@loopwear.com',
      passwordHash: ADMIN_PASSWORD_HASH,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      location: 'Bengaluru, India',
      rating: 5.0,
      status: 'active',
      swapsCompleted: 35,
      sustainabilityScore: {
        co2KgSaved: 140,
        waterLitersSaved: 48000,
        garmentsDiverted: 40
      },
      createdAt: '2026-07-01T08:00:00.000Z'
    }
  ],
  items: [
    {
      id: 'item_1',
      ownerId: 'user_1',
      ownerName: 'Rahul Sharma',
      ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      title: 'Nike Sportswear Club Fleece Pullover Hoodie',
      brand: 'Nike',
      category: 'Tops',
      size: 'L',
      condition: 'Gently Used',
      color: 'Heather Grey',
      estimatedValue: 1600,
      description: 'Iconic brushed-back fleece pullover hoodie from Nike. In warm heather grey with minimal wear around the cuffs. Features pouch pocket and adjustable drawstring hood. Perfect for casual layered streetwear.',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['Streetwear', 'Nike', 'Fleece', 'Athleisure', 'Autumn'],
      location: 'Indiranagar, Bengaluru',
      status: 'available',
      createdAt: '2026-09-28T10:00:00.000Z'
    },
    {
      id: 'item_2',
      ownerId: 'user_2',
      ownerName: 'Ananya Verma',
      ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      title: 'Zara Vintage Wash Denim Trucker Jacket',
      brand: 'Zara',
      category: 'Jackets & Outerwear',
      size: 'M',
      condition: 'Like New',
      color: 'Classic Vintage Blue',
      estimatedValue: 1750,
      description: 'Classic Zara denim jacket in premium medium-wash cotton. Features silver metallic buttons, dual chest flap pockets, and relaxed regular fit. Worn twice for a shoot, zero distress or fading flaws.',
      images: [
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['Denim', 'Zara', 'Jackets', 'Outerwear', 'VintageLook'],
      location: 'Koramangala, Bengaluru',
      status: 'available',
      createdAt: '2026-10-01T14:20:00.000Z'
    },
    {
      id: 'item_3',
      ownerId: 'user_2',
      ownerName: 'Ananya Verma',
      ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      title: "Levi's 501 Original Fit Straight Leg Jeans",
      brand: "Levi's",
      category: 'Bottoms',
      size: 'M',
      condition: 'Like New',
      color: 'Dark Indigo',
      estimatedValue: 2200,
      description: "The timeless Levi's 501 signature straight leg denim with iconic button fly. Rigid 100% cotton in dark stonewash. Hem and waist are in pristine state. A closet staple that lasts decades.",
      images: [
        'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ["Levi's", '501', 'Denim', 'Classic', 'Sustainable'],
      location: 'Koramangala, Bengaluru',
      status: 'available',
      createdAt: '2026-10-02T11:00:00.000Z'
    },
    {
      id: 'item_4',
      ownerId: 'user_3',
      ownerName: 'Priya Patel',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'H&M Floral Chiffon Tiered Midi Dress',
      brand: 'H&M',
      category: 'Dresses',
      size: 'S',
      condition: 'Brand New with Tags',
      color: 'Pastel Floral',
      estimatedValue: 1400,
      description: 'Breezy tiered midi dress crafted in airy printed chiffon with V-neckline and gathered waist. Never worn, original store tags still attached. Ideal for brunches or summer outings.',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['Floral', 'Summer', 'H&M', 'MidiDress', 'BNWT'],
      location: 'Bandra, Mumbai',
      status: 'available',
      createdAt: '2026-10-03T09:40:00.000Z'
    },
    {
      id: 'item_5',
      ownerId: 'user_1',
      ownerName: 'Rahul Sharma',
      ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      title: 'Adidas Originals Gazelle Suede Sneakers',
      brand: 'Adidas',
      category: 'Shoes',
      size: 'L',
      condition: 'Gently Used',
      color: 'Black / White',
      estimatedValue: 2600,
      description: 'Iconic low-profile sneaker with soft suede upper and white serrated 3-Stripes. Clean rubber outsole with very light tread wear. Cleaned and sanitized, comes with original laces.',
      images: [
        'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['Adidas', 'Sneakers', 'Gazelle', 'Footwear', 'Retro'],
      location: 'Indiranagar, Bengaluru',
      status: 'available',
      createdAt: '2026-09-25T16:15:00.000Z'
    },
    {
      id: 'item_6',
      ownerId: 'user_3',
      ownerName: 'Priya Patel',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Uniqlo Ultra Light Down Compact Jacket',
      brand: 'Uniqlo',
      category: 'Jackets & Outerwear',
      size: 'M',
      condition: 'Like New',
      color: 'Midnight Navy',
      estimatedValue: 2400,
      description: 'Feather-light down insulation with water-repellent coating. Folds down into its included compact carrying pouch. Extremely warm for its weight, ideal for travel or winter layering.',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['Uniqlo', 'DownJacket', 'WinterWear', 'Ultralight', 'Outerwear'],
      location: 'Bandra, Mumbai',
      status: 'available',
      createdAt: '2026-09-30T12:00:00.000Z'
    }
  ],
  swaps: [
    {
      id: 'swap_1',
      requesterId: 'user_1',
      recipientId: 'user_2',
      offeredItemId: 'item_1',
      offeredItemIds: ['item_1'],
      requestedItemId: 'item_2',
      status: 'pending',
      aiFairnessAssessment: {
        verdict: 'Fair Swap',
        score: 94,
        differenceAmount: 150,
        analysisText: 'Both items are from popular high-street and sportswear brands with high desirability. Estimated values are ₹1,600 and ₹1,750—a negligible difference of ₹150. The swap is balanced and mutually advantageous.',
        recommendation: 'Direct 1-to-1 swap is highly recommended without additional adjustments.'
      },
      message: 'Hey Ananya! Loved your Zara denim jacket. Would you like to swap with my Nike Club Fleece Hoodie?',
      counterofferHistory: [],
      createdAt: '2026-10-04T10:30:00.000Z',
      updatedAt: '2026-10-04T10:30:00.000Z'
    }
  ],
  conversations: [
    {
      id: 'conv_swap_1',
      swapId: 'swap_1',
      participants: ['user_1', 'user_2'],
      messages: [
        {
          id: 'msg_1',
          senderId: 'user_1',
          senderName: 'Rahul Sharma',
          text: 'Hey Ananya! Loved your Zara denim jacket. Would you be interested in swapping for my Nike Club Fleece Hoodie?',
          timestamp: '2026-10-04T10:32:00.000Z',
          read: true
        },
        {
          id: 'msg_2',
          senderId: 'user_2',
          senderName: 'Ananya Verma',
          text: "Hi Rahul! That's a great hoodie. The AI Fair Swap assessment says our items are within ₹150 of each other. Sounds like a fair trade to me!",
          timestamp: '2026-10-04T11:05:00.000Z',
          read: true
        }
      ],
      createdAt: '2026-10-04T10:30:00.000Z'
    }
  ],
  reports: [
    {
      id: 'rep_1',
      reporterId: 'user_1',
      targetType: 'item',
      targetId: 'item_4',
      reason: 'Incorrect condition tag listed initially (now resolved).',
      status: 'resolved',
      notes: 'Reviewed by admin. Listing is authentic.',
      createdAt: '2026-10-05T09:00:00.000Z'
    }
  ],
  auditLogs: [
    {
      id: 'audit_1',
      adminId: 'user_admin',
      action: 'SYSTEM_INIT',
      target: 'DATABASE',
      details: 'Initialized seed data with sustainable clothing items and sample users.',
      timestamp: '2026-10-01T00:00:00.000Z'
    }
  ]
};

class PersistentStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure required arrays exist
        return {
          users: parsed.users || [...INITIAL_SEED.users],
          items: parsed.items || [...INITIAL_SEED.items],
          swaps: parsed.swaps || [...INITIAL_SEED.swaps],
          conversations: parsed.conversations || [...INITIAL_SEED.conversations],
          reports: parsed.reports || [...INITIAL_SEED.reports],
          auditLogs: parsed.auditLogs || [...INITIAL_SEED.auditLogs]
        };
      }
    } catch (err) {
      console.warn('[DB] Failed reading store.json, re-initializing from seed:', err.message);
    }

    // Write initial seed to file
    this.saveData(INITIAL_SEED);
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }

  saveData(data) {
    try {
      const tempPath = `${STORE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data || this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, STORE_PATH);
    } catch (err) {
      console.error('[DB] Failed saving store.json:', err.message);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmailOrUsername(identifier) {
    const term = (identifier || '').trim().toLowerCase();
    return this.data.users.find(u => 
      u.email.toLowerCase() === term || 
      (u.username && u.username.toLowerCase() === term)
    );
  }

  createUser(userData) {
    const newUser = {
      id: userData.id || `user_${Date.now()}`,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      passwordHash: userData.passwordHash,
      role: userData.role || 'user',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      location: userData.location || 'Bengaluru, India',
      rating: 5.0,
      status: 'active',
      swapsCompleted: 0,
      sustainabilityScore: {
        co2KgSaved: 0,
        waterLitersSaved: 0,
        garmentsDiverted: 0
      },
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    this.saveData();
    return user;
  }

  // --- Items ---
  getItems() {
    return this.data.items;
  }

  findItemById(id) {
    return this.data.items.find(i => i.id === id);
  }

  createItem(itemData) {
    const newItem = {
      id: itemData.id || `item_${Date.now()}`,
      ownerId: itemData.ownerId,
      ownerName: itemData.ownerName,
      ownerAvatar: itemData.ownerAvatar,
      title: itemData.title,
      brand: itemData.brand,
      category: itemData.category,
      size: itemData.size,
      condition: itemData.condition,
      color: itemData.color || 'Neutral',
      estimatedValue: Number(itemData.estimatedValue) || 1500,
      description: itemData.description,
      images: Array.isArray(itemData.images) && itemData.images.length > 0 ? itemData.images : [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
      ],
      tags: Array.isArray(itemData.tags) ? itemData.tags : ['Loopwear', itemData.brand || 'Fashion'],
      location: itemData.location || 'Bengaluru, India',
      status: itemData.status || 'available',
      createdAt: new Date().toISOString()
    };
    this.data.items.unshift(newItem);
    this.saveData();
    return newItem;
  }

  updateItem(id, updates) {
    const item = this.findItemById(id);
    if (!item) return null;
    Object.assign(item, updates);
    this.saveData();
    return item;
  }

  deleteItem(id) {
    const index = this.data.items.findIndex(i => i.id === id);
    if (index === -1) return null;
    const [deleted] = this.data.items.splice(index, 1);
    this.saveData();
    return deleted;
  }

  // --- Swaps ---
  getSwaps() {
    return this.data.swaps;
  }

  findSwapById(id) {
    return this.data.swaps.find(s => s.id === id);
  }

  createSwap(swapData) {
    const newSwap = {
      id: swapData.id || `swap_${Date.now()}`,
      requesterId: swapData.requesterId,
      recipientId: swapData.recipientId,
      requestedItemId: swapData.requestedItemId,
      offeredItemId: swapData.offeredItemId || (swapData.offeredItemIds ? swapData.offeredItemIds[0] : null),
      offeredItemIds: swapData.offeredItemIds || [swapData.offeredItemId],
      status: swapData.status || 'pending',
      aiFairnessAssessment: swapData.aiFairnessAssessment || null,
      message: swapData.message || '',
      counterofferHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.swaps.unshift(newSwap);
    this.saveData();
    return newSwap;
  }

  updateSwap(id, updates) {
    const swap = this.findSwapById(id);
    if (!swap) return null;
    Object.assign(swap, updates, { updatedAt: new Date().toISOString() });
    this.saveData();
    return swap;
  }

  // --- Conversations & Messages ---
  getConversations() {
    return this.data.conversations;
  }

  findConversationById(id) {
    return this.data.conversations.find(c => c.id === id);
  }

  findConversationBySwapId(swapId) {
    return this.data.conversations.find(c => c.swapId === swapId);
  }

  createConversation(convData) {
    const newConv = {
      id: convData.id || `conv_${convData.swapId || Date.now()}`,
      swapId: convData.swapId,
      participants: convData.participants || [],
      messages: convData.messages || [],
      createdAt: new Date().toISOString()
    };
    this.data.conversations.unshift(newConv);
    this.saveData();
    return newConv;
  }

  addMessage(convIdOrSwapId, message) {
    let conv = this.findConversationById(convIdOrSwapId) || this.findConversationBySwapId(convIdOrSwapId);
    if (!conv) {
      conv = this.createConversation({
        id: `conv_${convIdOrSwapId}`,
        swapId: convIdOrSwapId,
        participants: [message.senderId]
      });
    }

    const newMsg = {
      id: message.id || `msg_${Date.now()}`,
      senderId: message.senderId,
      senderName: message.senderName || 'User',
      text: message.text,
      timestamp: new Date().toISOString(),
      read: false
    };

    conv.messages.push(newMsg);
    this.saveData();
    return { conv, message: newMsg };
  }

  // --- Reports & Moderation ---
  getReports() {
    return this.data.reports;
  }

  findReportById(id) {
    return this.data.reports.find(r => r.id === id);
  }

  createReport(reportData) {
    const newReport = {
      id: `rep_${Date.now()}`,
      reporterId: reportData.reporterId,
      targetType: reportData.targetType,
      targetId: reportData.targetId,
      reason: reportData.reason,
      status: 'pending',
      notes: '',
      createdAt: new Date().toISOString()
    };
    this.data.reports.unshift(newReport);
    this.saveData();
    return newReport;
  }

  updateReport(id, updates) {
    const report = this.findReportById(id);
    if (!report) return null;
    Object.assign(report, updates);
    this.saveData();
    return report;
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return this.data.auditLogs;
  }

  addAuditLog(entry) {
    const log = {
      id: `audit_${Date.now()}`,
      adminId: entry.adminId || 'system',
      action: entry.action,
      target: entry.target,
      details: entry.details,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    this.saveData();
    return log;
  }
}

export const db = new PersistentStore();
