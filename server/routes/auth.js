import express from 'express';
import { users } from '../data/mockStore.js';

const router = express.Router();

router.get('/users', (req, res) => {
  res.json({ success: true, users });
});

router.post('/login', (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId) || users[0];
  res.json({
    success: true,
    user,
    token: `demo_jwt_token_${user.id}`
  });
});

router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user_1';
  const user = users.find(u => u.id === userId) || users[0];
  res.json({ success: true, user });
});

export default router;
