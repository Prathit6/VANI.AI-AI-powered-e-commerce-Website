// routes/paymentRoute.js
const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const { authMiddleware } = require("../middlewares/authMiddleware");

// Both routes require the user to be logged in
router.post("/razorpay/create-order", authMiddleware, createRazorpayOrder);
router.post("/razorpay/verify", authMiddleware, verifyRazorpayPayment);

module.exports = router;
