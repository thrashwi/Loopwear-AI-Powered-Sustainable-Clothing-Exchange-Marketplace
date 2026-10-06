import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import swapsRoutes from './routes/swaps.js';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import { conversations, users } from './data/mockStore.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_swap_room', ({ swapId }) => {
    socket.join(swapId);
    console.log(`[Socket.IO] Client ${socket.id} joined room ${swapId}`);
  });

  socket.on('send_message', ({ swapId, senderId, text }) => {
    const user = users.find(u => u.id === senderId) || { name: 'User' };
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName: user.name,
      text,
      timestamp: new Date().toISOString()
    };

    let conv = conversations.find(c => c.swapId === swapId);
    if (conv) {
      conv.messages.push(newMsg);
    }

    io.to(swapId).emit('receive_message', newMsg);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/swaps', swapsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Loopwear API',
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    aiMode: process.env.GEMINI_API_KEY ? 'Google Gemini 1.5 Flash' : 'Smart Heuristic Engine (Zero-Key Demo Ready)'
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Loopwear Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Status: ${process.env.GEMINI_API_KEY ? 'Gemini API Connected' : 'Demo Fallback Mode Active (Set GEMINI_API_KEY in server/.env to activate Gemini)'}`);
});
