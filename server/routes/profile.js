import express from 'express';
import { db } from '../data/db.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = express.Router();

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

// 1. Get profile
router.get('/', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const user = db.findUserById(currentUserId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }

  // Calculate swap history
  const allSwaps = db.getSwaps();
  const allItems = db.getItems();
  const userSwaps = allSwaps.filter(s => s.requesterId === user.id || s.recipientId === user.id);
  const completedSwaps = userSwaps.filter(s => s.status === 'completed').map(s => {
    const requested = allItems.find(i => i.id === s.requestedItemId);
    const offeredIds = Array.isArray(s.offeredItemIds) ? s.offeredItemIds : [s.offeredItemId];
    const offered = allItems.filter(i => offeredIds.includes(i.id));
    return {
      ...s,
      requestedItem: requested,
      offeredItems: offered
    };
  });

  res.json({
    success: true,
    profile: sanitizeUser(user),
    completedSwaps,
    totalCompleted: completedSwaps.length
  });
});

// 2. Update profile
router.put('/', requireAuth, (req, res) => {
  const { name, location, avatar, bio } = req.body;
  const updates = {};
  if (name && name.trim()) updates.name = name.trim();
  if (location && location.trim()) updates.location = location.trim();
  if (avatar && avatar.trim()) updates.avatar = avatar.trim();
  if (bio !== undefined) updates.bio = bio.trim();

  const updated = db.updateUser(req.user.id, updates);
  res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: sanitizeUser(updated)
  });
});

export default router;
