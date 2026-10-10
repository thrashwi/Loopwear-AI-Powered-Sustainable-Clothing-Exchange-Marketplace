import express from 'express';
import { db } from '../data/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const { targetType, targetId, reason } = req.body;

  if (!targetType || !['item', 'user'].includes(targetType)) {
    return res.status(400).json({ success: false, message: 'Invalid target type. Must be "item" or "user".' });
  }

  if (!targetId || !reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'Target ID and explanation reason are required.' });
  }

  const newReport = db.createReport({
    reporterId: currentUserId,
    targetType,
    targetId,
    reason: reason.trim()
  });

  res.status(201).json({
    success: true,
    message: 'Report submitted to moderation for review.',
    report: newReport
  });
});

export default router;
