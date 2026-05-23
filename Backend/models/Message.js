const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderName: { type: String, default: '' },
  message: { type: String, required: true },
  timestamp: { type: Number, default: () => Date.now() },
}, { timestamps: true });

// Index for fast conversation lookup
messageSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model('Message', messageSchema);
