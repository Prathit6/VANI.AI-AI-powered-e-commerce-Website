const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoute');
const paymentRoute = require('./routes/paymentRoute');
const { dbConnect } = require('./utils/db');
const Message = require('./models/Message');
const reviewRoute = require('./routes/reviewRoute');


const path = require('path');

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());
app.use('/api/payments', paymentRoute);
app.use('/api', authRoutes);
app.use('/api', reviewRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ── Message history ───────────────────────────────────────────────────────────
// GET /api/messages/:userId?adminId=xxx
// Works for BOTH directions:
//   - Seller fetches: userId=sellerId, adminId=adminId
//   - Admin fetches:  userId=sellerId, adminId=adminId (same route, same logic)
app.get('/api/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminId } = req.query;
    if (!adminId) return res.status(400).json({ error: 'adminId query param required' });

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: adminId },
        { senderId: adminId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/', (req, res) => res.send('Backend running'));
dbConnect();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ── In-Memory User Store ──────────────────────────────────────────────────────
//
// WHY THIS WORKS IN SAME BROWSER, 2 TABS:
// - Tab 1 (Admin) and Tab 2 (Seller) each have their own JS runtime/Redux store
// - Each tab creates its own socket connection → gets a unique socket.id from server
// - Server stores: userId → Set of socket IDs (one per tab/connection)
// - When admin sends a message, server looks up seller's socket IDs and emits to all of them
// - localStorage is SHARED between tabs but Redux state is NOT — that's why we read role
//   from Redux (tab-specific) rather than relying solely on localStorage
//
// DATA STRUCTURE:
// users Map: "mongoObjectIdString" → { role: "admin"|"seller", name: "...", sockets: Set<socketId> }
// socketToUser Map: "socketId" → "mongoObjectIdString"

const users = new Map();       // userId(string) → { role, name, sockets: Set }
const socketToUser = new Map(); // socketId → userId(string)

function printUsers() {
  console.log('\n── ONLINE USERS ──');
  if (users.size === 0) { console.log('  (none)'); }
  for (const [uid, info] of users.entries()) {
    console.log(`  [${info.role.toUpperCase()}] "${info.name}" | id=${uid} | sockets=${info.sockets.size}`);
  }
  console.log('──────────────────\n');
}

// addSocket: register a socket for a userId
// IMPORTANT: userId must be String(mongoId) — ObjectId comparison fails otherwise
function addSocket(userId, socketId, role, name) {
  const uid = String(userId); // ← always stringify MongoDB ObjectId
  if (!users.has(uid)) {
    users.set(uid, { role, name: name || '', sockets: new Set() });
  }
  const u = users.get(uid);
  u.sockets.add(socketId);
  u.role = role;
  if (name) u.name = name;
  socketToUser.set(socketId, uid);
}

// removeSocket: clean up when a socket disconnects
function removeSocket(socketId) {
  const userId = socketToUser.get(socketId);
  if (!userId) return null;
  socketToUser.delete(socketId);
  const info = users.get(userId);
  if (!info) return null;
  info.sockets.delete(socketId);
  const fullyGone = info.sockets.size === 0;
  const role = info.role;
  if (fullyGone) users.delete(userId);
  return { userId, role, fullyGone };
}

function getAdminOnline() {
  for (const info of users.values()) {
    if (info.role === 'admin' && info.sockets.size > 0) return true;
  }
  return false;
}

function getOnlineSellers() {
  const list = [];
  for (const [userId, info] of users.entries()) {
    if (info.role === 'seller' && info.sockets.size > 0) {
      list.push({ id: userId, name: info.name });
    }
  }
  return list;
}

// emitToUser: send event to ALL sockets of a given userId
// This handles the case where one user has multiple tabs open
function emitToUser(userId, event, data) {
  const uid = String(userId); // always stringify
  const info = users.get(uid);
  if (!info) {
    console.log(`  [emitToUser] ⚠️  userId="${uid}" not found in store`);
    return;
  }
  for (const sockId of info.sockets) {
    io.to(sockId).emit(event, data);
  }
}

// Push admin online/offline status to ALL connected sellers
function pushAdminStatus() {
  const online = getAdminOnline();
  console.log(`[pushAdminStatus] admin online=${online}`);
  for (const [userId, info] of users.entries()) {
    if (info.role === 'seller') {
      emitToUser(userId, 'admin_status', { online });
    }
  }
}

// Push list of online sellers to ALL connected admins
function pushSellerList() {
  const sellers = getOnlineSellers();
  console.log(`[pushSellerList] sellers=`, sellers.map(s => s.name));
  for (const [userId, info] of users.entries()) {
    if (info.role === 'admin') {
      emitToUser(userId, 'online_sellers', sellers);
    }
  }
}

// ── Socket Events ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`\n[CONNECT] socket=${socket.id}`);

  // user_connected: fired by SocketProvider after socket connects
  // payload = { userId: string, role: "admin"|"seller", name: string }
  socket.on('user_connected', (payload) => {
    console.log(`[user_connected] payload=`, payload);

    if (typeof payload !== 'object' || payload === null) {
      console.error('❌ Invalid payload — must be an object');
      return;
    }

    const { userId, role, name } = payload;

    if (!userId) {
      console.error('❌ No userId in payload. Check that authController returns both id and _id in userInfo.');
      return;
    }

    if (!role || (role !== 'admin' && role !== 'seller')) {
      console.error(`❌ Invalid role="${role}". Only admin and seller connect to socket.`);
      return;
    }

    addSocket(userId, socket.id, role, name || '');
    console.log(`✅ Registered: [${role.toUpperCase()}] "${name}" (${userId}) | socket=${socket.id}`);
    printUsers();

    // Send current state immediately to this socket
    if (role === 'seller') {
      const adminOnline = getAdminOnline();
      console.log(`  → Telling seller: admin is ${adminOnline ? 'ONLINE ✅' : 'OFFLINE ❌'}`);
      socket.emit('admin_status', { online: adminOnline });
    }

    if (role === 'admin') {
      const sellers = getOnlineSellers();
      console.log(`  → Telling admin: online sellers =`, sellers);
      socket.emit('online_sellers', sellers);
    }

    // Broadcast updated status to everyone
    pushAdminStatus();
    pushSellerList();
  });

  // send_message: fired by seller or admin when they send a chat message
  // data = { senderId, receiverId, senderName, message, timestamp }
  // Flow:
  //   1. Save to MongoDB (permanent storage)
  //   2. Emit 'receive_message' to receiver
  //   3. Emit 'message_sent' back to sender (for confirmation + replacing optimistic message)
  socket.on('send_message', async (data) => {
    console.log(`\n[send_message] from="${data.senderName}" to="${data.receiverId}" msg="${data.message}"`);

    try {
      // Save permanently to DB
      const saved = await Message.create({
        senderId: String(data.senderId),
        receiverId: String(data.receiverId),
        senderName: data.senderName || '',
        message: data.message,
        timestamp: data.timestamp || Date.now(),
      });

      const payload = {
        _id: String(saved._id),
        senderId: saved.senderId,
        receiverId: saved.receiverId,
        senderName: saved.senderName,
        message: saved.message,
        timestamp: saved.timestamp,
      };

      console.log(`  ✅ Saved to DB: ${saved._id}`);
      console.log(`  → Sending 'receive_message' to ${data.receiverId}`);
      console.log(`  → Sending 'message_sent' to ${data.senderId}`);

      // Deliver to receiver's socket(s)
      emitToUser(String(data.receiverId), 'receive_message', payload);

      // Confirm to sender (replaces optimistic message in UI)
      emitToUser(String(data.senderId), 'message_sent', payload);

    } catch (err) {
      console.error('❌ Message save error:', err.message);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // disconnect: clean up when a tab closes or network drops
  socket.on('disconnect', (reason) => {
    console.log(`\n[DISCONNECT] socket=${socket.id} reason=${reason}`);
    const removed = removeSocket(socket.id);
    if (removed) {
      console.log(`  Removed: ${removed.role} (${removed.userId}) | fullyOffline=${removed.fullyGone}`);
    } else {
      console.log('  ⚠️  Socket not in store (user_connected never fired for this socket)');
    }
    printUsers();
    // Notify others of updated status
    pushAdminStatus();
    pushSellerList();
  });
});

const port = process.env.PORT || 5001;
server.listen(port, () => console.log(`\n🚀 Server on port ${port}\n`));
