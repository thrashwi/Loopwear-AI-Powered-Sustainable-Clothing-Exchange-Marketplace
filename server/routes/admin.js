import express from 'express';
import { db } from '../data/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAdmin to all endpoints in this router
router.use(requireAdmin);

// 1. Dashboard analytics
router.get('/analytics', (req, res) => {
  const users = db.getUsers();
  const items = db.getItems();
  const swaps = db.getSwaps();
  const reports = db.getReports();
  const auditLogs = db.getAuditLogs();

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  const totalListings = items.length;
  const activeListings = items.filter(i => i.status === 'available').length;
  const reservedListings = items.filter(i => i.status === 'reserved').length;
  const swappedListings = items.filter(i => i.status === 'swapped').length;

  const totalSwaps = swaps.length;
  const pendingSwaps = swaps.filter(s => s.status === 'pending').length;
  const acceptedSwaps = swaps.filter(s => s.status === 'accepted').length;
  const completedSwaps = swaps.filter(s => s.status === 'completed').length;
  const rejectedSwaps = swaps.filter(s => s.status === 'rejected').length;

  // Aggregate sustainability metrics
  let totalCo2Saved = 0;
  let totalWaterSaved = 0;
  let totalGarmentsDiverted = 0;

  users.forEach(u => {
    if (u.sustainabilityScore) {
      totalCo2Saved += u.sustainabilityScore.co2KgSaved || 0;
      totalWaterSaved += u.sustainabilityScore.waterLitersSaved || 0;
      totalGarmentsDiverted += u.sustainabilityScore.garmentsDiverted || 0;
    }
  });

  res.json({
    success: true,
    analytics: {
      users: { total: totalUsers, active: activeUsers, suspended: suspendedUsers },
      listings: { total: totalListings, active: activeListings, reserved: reservedListings, swapped: swappedListings },
      swaps: { total: totalSwaps, pending: pendingSwaps, accepted: acceptedSwaps, completed: completedSwaps, rejected: rejectedSwaps },
      sustainability: {
        totalCo2SavedKg: Math.round(totalCo2Saved * 10) / 10,
        totalWaterSavedLiters: Math.round(totalWaterSaved),
        totalGarmentsDiverted
      },
      pendingReportsCount: reports.filter(r => r.status === 'pending').length,
      recentAuditLogs: auditLogs.slice(0, 8)
    }
  });
});

// 2. View all users
router.get('/users', (req, res) => {
  const users = db.getUsers().map(({ passwordHash, ...safe }) => {
    const userItems = db.getItems().filter(i => i.ownerId === safe.id);
    return {
      ...safe,
      listingCount: userItems.length
    };
  });
  res.json({ success: true, count: users.length, users });
});

// 3. Suspend or reactivate user
router.put('/users/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status. Must be "active" or "suspended".' });
  }

  const user = db.findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user.role === 'admin' && status === 'suspended') {
    return res.status(400).json({ success: false, message: 'Cannot suspend an administrator account.' });
  }

  const updated = db.updateUser(user.id, { status });

  db.addAuditLog({
    adminId: req.user.id,
    action: status === 'suspended' ? 'USER_SUSPEND' : 'USER_REACTIVATE',
    target: user.id,
    details: `Admin changed status of ${user.name} (${user.email}) to ${status}`
  });

  const { passwordHash, ...safe } = updated;
  res.json({
    success: true,
    message: `User account is now ${status}.`,
    user: safe
  });
});

// 4. View all listings for moderation
router.get('/listings', (req, res) => {
  const listings = db.getItems();
  res.json({ success: true, count: listings.length, listings });
});

// 5. Remove inappropriate listing
router.delete('/listings/:id', (req, res) => {
  const item = db.findItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }

  const deleted = db.deleteItem(item.id);

  db.addAuditLog({
    adminId: req.user.id,
    action: 'LISTING_DELETE',
    target: item.id,
    details: `Admin removed listing "${item.title}" by owner ${item.ownerName}`
  });

  res.json({
    success: true,
    message: 'Listing removed by moderation.',
    item: deleted
  });
});

// 6. View all reports
router.get('/reports', (req, res) => {
  const reports = db.getReports().map(r => {
    const reporter = db.findUserById(r.reporterId);
    let targetDetails = null;
    if (r.targetType === 'item') {
      targetDetails = db.findItemById(r.targetId);
    } else if (r.targetType === 'user') {
      const u = db.findUserById(r.targetId);
      if (u) {
        const { passwordHash, ...safe } = u;
        targetDetails = safe;
      }
    }
    return {
      ...r,
      reporterName: reporter ? reporter.name : 'User',
      targetDetails
    };
  });

  res.json({ success: true, count: reports.length, reports });
});

// 7. Update report resolution status
router.put('/reports/:id', (req, res) => {
  const { status, notes } = req.body;
  const report = db.findReportById(req.params.id);

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found.' });
  }

  const updates = {};
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const updated = db.updateReport(report.id, updates);

  db.addAuditLog({
    adminId: req.user.id,
    action: 'REPORT_RESOLUTION',
    target: report.id,
    details: `Admin set report ${report.id} status to ${status}. Notes: ${notes || 'none'}`
  });

  res.json({
    success: true,
    message: 'Report status updated.',
    report: updated
  });
});

export default router;
