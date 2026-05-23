// models/admin.model.js
const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
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
});

module.exports = model('admins', adminSchema);