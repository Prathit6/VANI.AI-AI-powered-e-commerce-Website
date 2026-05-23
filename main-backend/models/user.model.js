// models/user.model.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: {
      type: String,
      default: "user.png",
    },
    role: {
      type: String,
      default: "user",
    },
    // ── NEW: profile fields ───────────────────────────────────────────────
    location: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    // ─────────────────────────────────────────────────────────────────────
    shippingInfo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = model("users", userSchema);