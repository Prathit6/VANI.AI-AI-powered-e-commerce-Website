// controllers/paymentController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { responseReturn } = require("../utils/response");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ─────────────────────────────────────────────────────────────
   POST /api/payments/razorpay/create-order
   Body: { amount }  ← amount in paise (cents)
   Creates a Razorpay order and returns { id, amount, currency }
───────────────────────────────────────────────────────────── */
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return responseReturn(res, 400, { error: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount), // paise — must be integer
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return responseReturn(res, 200, {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return responseReturn(res, 500, {
      error: err.error?.description || "Failed to create payment order",
    });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/payments/razorpay/verify
   Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   Verifies HMAC signature — if mismatch, payment is rejected
───────────────────────────────────────────────────────────── */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return responseReturn(res, 400, { error: "Missing payment fields" });
    }

    // Razorpay signature verification
    // Formula: HMAC-SHA256( order_id + "|" + payment_id, key_secret )
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return responseReturn(res, 400, { error: "Payment verification failed — invalid signature" });
    }

    // Signature valid ✓
    return responseReturn(res, 200, {
      success: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return responseReturn(res, 500, { error: "Payment verification error" });
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
