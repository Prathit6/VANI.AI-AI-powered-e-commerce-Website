// models/seller.model.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: 'seller',
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending',
  },
  shopInfo: {
    shopName: { type: String, default: '' },
    division: { type: String, default: '' },
    district: { type: String, default: '' },
    category: { type: String, default: '' },
  },
  image: {
    type: String,
    default: '',
  },
  payment: {
    type: String,
    default: 'inactive',
  },
  // ── NEW: profile fields ───────────────────────────────────────────────────
  location: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  // ─────────────────────────────────────────────────────────────────────────
}, { timestamps: true });

module.exports = mongoose.model('sellers', sellerSchema);