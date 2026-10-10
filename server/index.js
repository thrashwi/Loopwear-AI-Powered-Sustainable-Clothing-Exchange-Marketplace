import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import swapsRoutes from './routes/swaps.js';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import dashboardRoutes from './routes/dashboard.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';
import reportsRoutes from './routes/reports.js';
import { db } from './data/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration supporting credentials
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Real-time Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Join room by swapId or conversationId
  socket.on('join_swap_room', ({ swapId }) => {
    if (swapId) {
      socket.join(swapId);
      console.log(`[Socket.IO] Client ${socket.id} joined room: ${swapId}`);
    }
  });

  socket.on('join_room', ({ roomId }) => {
    if (roomId) {
      socket.join(roomId);
      console.log(`[Socket.IO] Client ${socket.id} joined room: ${roomId}`);
    }
  });

  // Handle sending message in real time
  socket.on('send_message', ({ swapId, conversationId, senderId, text }) => {
    const targetId = swapId || conversationId;
    if (!targetId || !text) return;

    const user = db.findUserById(senderId) || { name: 'User' };
    const { message } = db.addMessage(targetId, {
      senderId,
      senderName: user.name,
      text
    });

    // Broadcast to room
    io.to(targetId).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/listings', itemsRoutes); // Alias for prompt requirement
app.use('/api/swaps', swapsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', chatRoutes); // Alias for prompt requirement
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Loopwear API',
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    aiMode: process.env.GEMINI_API_KEY ? 'Google Gemini 1.5 Flash' : 'Smart Heuristic Engine (Zero-Key Demo Ready)',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 Loopwear Server running on http://localhost:${PORT}`);
    console.log(`🤖 AI Status: ${process.env.GEMINI_API_KEY ? 'Gemini API Connected' : 'Demo Fallback Mode Active (Set GEMINI_API_KEY in server/.env to activate Gemini)'}`);
  });
}

export { app, server };
