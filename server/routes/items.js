import express from 'express';
import { items, users } from '../data/mockStore.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { category, size, condition, search, excludeOwner, ownerId } = req.query;
  let results = [...items];

  if (category && category !== 'All') {
    results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (size && size !== 'All') {
    results = results.filter(item => item.size === size);
  }

  if (condition && condition !== 'All') {
    results = results.filter(item => item.condition === condition);
  }

  if (ownerId) {
    results = results.filter(item => item.ownerId === ownerId);
  }

  if (excludeOwner) {
    results = results.filter(item => item.ownerId !== excludeOwner);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: results.length, items: results });
});

router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  const owner = users.find(u => u.id === item.ownerId);
  res.json({ success: true, item, owner });
});

router.post('/', (req, res) => {
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
    tags
  } = req.body;

  const currentUserId = req.headers['x-user-id'] || 'user_1';
  const owner = users.find(u => u.id === currentUserId) || users[0];

  const newItem = {
    id: `item_${Date.now()}`,
    ownerId: owner.id,
    ownerName: owner.name,
    ownerAvatar: owner.avatar,
    title: title || `${brand || 'Classic'} ${category || 'Item'}`,
    brand: brand || 'Unbranded',
    category: category || 'Tops',
    size: size || 'M',
    condition: condition || 'Gently Used',
    color: color || 'Neutral',
    estimatedValue: Number(estimatedValue) || 1500,
    description: description || 'Great clothing item available for direct swap.',
    images: (images && images.length > 0) ? images : [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: Array.isArray(tags) ? tags : ['Loopwear', brand || 'Fashion'],
    status: 'available',
    createdAt: new Date().toISOString()
  };

  items.unshift(newItem);
  res.status(201).json({ success: true, item: newItem });
});

router.delete('/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  const [removed] = items.splice(idx, 1);
  res.json({ success: true, message: 'Item deleted', item: removed });
});

export default router;
