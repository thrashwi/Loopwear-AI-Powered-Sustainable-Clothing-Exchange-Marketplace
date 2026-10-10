import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../data/db.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `item_${Date.now()}_${Math.round(Math.random() * 1E6)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, and GIF images are permitted.'));
    }
  }
});

const router = express.Router();

// 1. Image upload endpoint
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
});

// 2. Get current user's listings
router.get('/mine', authenticate, (req, res) => {
  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const items = db.getItems().filter(i => i.ownerId === currentUserId);
  res.json({ success: true, count: items.length, items });
});

// 3. List all items with search, filters, location discovery, and sorting
router.get('/', authenticate, (req, res) => {
  const {
    category,
    size,
    condition,
    brand,
    minVal,
    maxVal,
    location,
    search,
    excludeOwner,
    ownerId,
    sort,
    status
  } = req.query;

  let results = [...db.getItems()];

  // Filter available by default unless specified
  if (status) {
    if (status !== 'all') {
      results = results.filter(item => item.status === status);
    }
  } else {
    results = results.filter(item => item.status === 'available');
  }

  // Filter by category
  if (category && category !== 'All') {
    results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by size
  if (size && size !== 'All') {
    results = results.filter(item => item.size === size);
  }

  // Filter by condition
  if (condition && condition !== 'All') {
    results = results.filter(item => item.condition === condition);
  }

  // Filter by brand
  if (brand && brand !== 'All') {
    results = results.filter(item => item.brand.toLowerCase().includes(brand.toLowerCase()));
  }

  // Filter by estimated value range
  if (minVal) {
    results = results.filter(item => item.estimatedValue >= Number(minVal));
  }
  if (maxVal) {
    results = results.filter(item => item.estimatedValue <= Number(maxVal));
  }

  // Filter by location (city / locality match)
  if (location && location.trim() && location !== 'All') {
    const locTerm = location.trim().toLowerCase();
    results = results.filter(item => (item.location || '').toLowerCase().includes(locTerm));
  }

  // Owner filters
  if (ownerId) {
    results = results.filter(item => item.ownerId === ownerId);
  }

  if (excludeOwner) {
    results = results.filter(item => item.ownerId !== excludeOwner);
  }

  // Keyword Search
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'oldest') {
    results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'value_asc') {
    results.sort((a, b) => a.estimatedValue - b.estimatedValue);
  } else if (sort === 'value_desc') {
    results.sort((a, b) => b.estimatedValue - a.estimatedValue);
  } else {
    // Default newest first
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json({ success: true, count: results.length, items: results });
});

// 4. Get single item by ID with owner information
router.get('/:id', (req, res) => {
  const item = db.findItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Clothing item not found.' });
  }

  const owner = db.findUserById(item.ownerId);
  const safeOwner = owner ? {
    id: owner.id,
    name: owner.name,
    username: owner.username,
    avatar: owner.avatar,
    location: owner.location,
    rating: owner.rating,
    swapsCompleted: owner.swapsCompleted,
    sustainabilityScore: owner.sustainabilityScore
  } : null;

  // Other items by same owner
  const otherItems = db.getItems()
    .filter(i => i.ownerId === item.ownerId && i.id !== item.id && i.status === 'available')
    .slice(0, 3);

  res.json({
    success: true,
    item,
    owner: safeOwner,
    otherItems
  });
});

// 5. Create new listing
router.post('/', authenticate, (req, res) => {
  const {
    title,
    brand,
    category,
    size,
    condition,
    color,
    estimatedValue,
    description,
    images,
    tags,
    location
  } = req.body;

  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const owner = db.findUserById(currentUserId) || db.getUsers()[0];

  // Basic validation
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Item title is required.' });
  }
  if (!category) {
    return res.status(400).json({ success: false, message: 'Clothing category is required.' });
  }
  if (!size) {
    return res.status(400).json({ success: false, message: 'Clothing size is required.' });
  }
  if (!condition) {
    return res.status(400).json({ success: false, message: 'Condition is required.' });
  }

  const newItem = db.createItem({
    ownerId: owner.id,
    ownerName: owner.name,
    ownerAvatar: owner.avatar,
    title: title.trim(),
    brand: brand ? brand.trim() : 'Unbranded',
    category,
    size,
    condition,
    color: color ? color.trim() : 'Neutral',
    estimatedValue: Number(estimatedValue) || 1500,
    description: description ? description.trim() : 'Sustainable pre-loved clothing ready for exchange.',
    images: Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: Array.isArray(tags) ? tags : ['Loopwear', brand || 'Fashion'],
    location: location || owner.location || 'Bengaluru, India',
    status: 'available'
  });

  res.status(201).json({
    success: true,
    message: 'Listing published successfully!',
    item: newItem
  });
});

// 6. Update listing (Owner only or Admin)
router.put('/:id', authenticate, (req, res) => {
  const item = db.findItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found.' });
  }

  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const isAdmin = req.user && req.user.role === 'admin';

  if (item.ownerId !== currentUserId && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Unauthorized. You can only edit your own listings.' });
  }

  const {
    title,
    brand,
    category,
    size,
    condition,
    color,
    estimatedValue,
    description,
    images,
    tags,
    location,
    status
  } = req.body;

  const updates = {};
  if (title) updates.title = title.trim();
  if (brand) updates.brand = brand.trim();
  if (category) updates.category = category;
  if (size) updates.size = size;
  if (condition) updates.condition = condition;
  if (color) updates.color = color;
  if (estimatedValue) updates.estimatedValue = Number(estimatedValue);
  if (description) updates.description = description.trim();
  if (Array.isArray(images)) updates.images = images;
  if (Array.isArray(tags)) updates.tags = tags;
  if (location) updates.location = location;
  if (status) updates.status = status;

  const updatedItem = db.updateItem(item.id, updates);
  res.json({
    success: true,
    message: 'Listing updated successfully.',
    item: updatedItem
  });
});

// 7. Delete listing (Owner only or Admin)
router.delete('/:id', authenticate, (req, res) => {
  const item = db.findItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found.' });
  }

  const currentUserId = req.user ? req.user.id : (req.headers['x-user-id'] || 'user_1');
  const isAdmin = req.user && req.user.role === 'admin';

  if (item.ownerId !== currentUserId && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Unauthorized. You can only delete your own listings.' });
  }

  const deleted = db.deleteItem(item.id);
  res.json({
    success: true,
    message: 'Listing removed successfully.',
    item: deleted
  });
});

export default router;
