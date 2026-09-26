const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io available in controllers
app.set('io', io);

// Test route
app.get('/', (req, res) => {
  res.send('SheShield API running');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/legal-chat', require('./routes/legalChatRoutes'));
app.use('/api/incident', require('./routes/incidentRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// ------------------------------------
// Socket.IO Authentication Middleware
// ------------------------------------

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Unauthorized: Token missing'));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.userId = decoded.id;

    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Unauthorized'));
  }
});

// ------------------------------------
// Socket.IO Connection
// ------------------------------------

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join particular incident room
  socket.on('join-incident', (incidentId) => {
    if (!incidentId) return;

    socket.join(`incident:${incidentId}`);

    console.log(
      `Socket ${socket.id} joined incident:${incidentId}`
    );
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error middleware
app.use(require('./middleware/errorMiddleware'));

// Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});