import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck, Lock, CreditCard, Smartphone, Package,
  ChevronRight, AlertCircle, RotateCcw, CheckCircle2,
  User, Calendar, KeyRound, Loader2,
} from "lucide-react";
import axios from "axios";
import { useCart } from "../../../context/CartProvider";
import { formatMoney } from "../../../utils/Money";
import "./paymentPage.css";

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX";

const FIXED_UPI_ID = "9302528274@ybl";

// Sends cookies (accessToken) to ecommerce-backend
const shopApi = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace('/api', ''),
  withCredentials: true,
});

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentPage() {
  const { cart, loadCart } = useCart();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiConfirmed, setUpiConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMethod, setActiveMethod] = useState("card");
  const [errors, setErrors] = useState({});

  /* ── Calculations ─────────────────────────────────────────────────────── */
  const productCostCents = cart?.reduce((s, i) => s + i.product.priceCents * i.quantity, 0) ?? 0;
  const totalQuantity = cart?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const shippingCostCents = 999;
  const totalBeforeTax = productCostCents + shippingCostCents;
  const taxCents = Math.round(totalBeforeTax * 0.1);
  const totalCents = totalBeforeTax + taxCents;

  /* ── Formatters ───────────────────────────────────────────────────────── */
  const formatCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const getCardBrand = () => {
    const n = cardNumber.replace(/\s/g, "");
    if (n.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(n)) return "mastercard";
    if (/^3[47]/.test(n)) return "amex";
    return "generic";
  };

  /* ── Validation ───────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (activeMethod === "card") {
      if (!cardName.trim()) e.cardName = "Name is required";
      if (cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit number";
      if (!expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "Enter expiry as MM/YY";
      if (cvv.length < 3) e.cvv = "CVV must be 3–4 digits";
    }
    if (activeMethod === "upi") {
      if (!upiConfirmed) e.upi = "Please confirm you have sent the payment to the UPI ID above.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Razorpay flow (card only) ────────────────────────────────────────── */
  const handleRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error("Failed to load Razorpay. Check your internet connection.");

    // Tell backend to create the order in USD
    const { data: rzpOrder } = await axios.post(
      "http://localhost:5001/api/payments/razorpay/create-order",
      { amount: totalCents, currency: "USD" },
      { withCredentials: true }
    );

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: "USD",          // ← force USD, never fall back to INR
        name: "VANI.AI",
        description: `${totalQuantity} item${totalQuantity > 1 ? "s" : ""}`,
        order_id: rzpOrder.id,
        prefill: {
          name: cardName,
          method: "card",
        },
        theme: { color: "#111111" },
        handler: async (response) => {
          try {
            await axios.post(
              "http://localhost:5001/api/payments/razorpay/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );
            resolve(true);
          } catch (err) {
            reject(err);
          }
        },
        modal: { ondismiss: () => reject(new Error("Payment cancelled by user")) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) =>
        reject(new Error(r.error?.description || "Payment failed"))
      );
      rzp.open();
    });
  };

  /* ── Main payment handler ─────────────────────────────────────────────── */
  const handlePayment = async () => {
    if (!validate()) return;
    setIsProcessing(true);
    setErrors({});

    try {
      if (activeMethod === "cod") {
        // No payment gateway — place order directly
        await shopApi.post("/api/orders", { paymentMethod: "cod" });
      } else if (activeMethod === "upi") {
        // User confirmed manual UPI transfer — just create the order
        await shopApi.post("/api/orders", { paymentMethod: "upi" });
      } else {
        // Card — go through Razorpay, then create order
        await handleRazorpay();
        await shopApi.post("/api/orders", { paymentMethod: "card" });
      }
      await loadCart();
      navigate("/orders");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Payment failed. Please try again.";
      if (msg !== "Payment cancelled by user") setErrors({ global: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  /* ── Empty cart ───────────────────────────────────────────────────────── */
  if (!cart || cart.length === 0) {
    return (
      <div className="pp-empty">
        <Package size={52} strokeWidth={1.2} />
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  const brand = getCardBrand();

  return (
    <div className="pp-root">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="pp-header">
        <div className="pp-header-inner">
          <div className="pp-header-left">
            <Link to="/" className="pp-logo">
              <span className="pp-logo-sq">V</span>
              <span className="pp-logo-txt">ANI.AI</span>
            </Link>
            <Link to="/" className="pp-products-link">Products</Link>
          </div>
          <div className="pp-header-mid">
            Secure Checkout&nbsp;(
            <Link className="pp-return-link" to="/checkout">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </Link>
            )
          </div>
          <div className="pp-header-right">
            <span className="pp-secure-badge">
              <ShieldCheck size={13} strokeWidth={2.2} /> SSL Secured
            </span>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <main className="pp-main">
        <div className="pp-grid">

          {/* ── LEFT ──────────────────────────────────────────────────── */}
          <section className="pp-form-section">

            <div className="pp-breadcrumb">
              <span className="pp-bc-step done">Cart</span>
              <ChevronRight size={13} className="pp-bc-sep" />
              <span className="pp-bc-step done">Checkout</span>
              <ChevronRight size={13} className="pp-bc-sep" />
              <span className="pp-bc-step active">Payment</span>
            </div>

            <h1 className="pp-title">Payment Details</h1>

            {/* ── Method tabs ─────────────────────────────────────────── */}
            <div className="pp-method-tabs">
              {[
                { id: "card", label: "Card", Icon: CreditCard },
                { id: "upi", label: "UPI", Icon: Smartphone },
                { id: "cod", label: "Cash on Delivery", Icon: Package },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`pp-method-tab${activeMethod === id ? " active" : ""}`}
                  onClick={() => { setActiveMethod(id); setErrors({}); setUpiConfirmed(false); }}
                >
                  <Icon size={15} strokeWidth={1.8} /> {label}
                </button>
              ))}
            </div>

            {/* ── Card ────────────────────────────────────────────────── */}
            {activeMethod === "card" && (
              <div className="pp-card-form">
                <div className="pp-card-preview">
                  <div className="pp-card-row-top">
                    <div className="pp-chip" />
                    <div className="pp-brand-slot">
                      {brand === "visa" && <span className="pp-brand-visa">VISA</span>}
                      {brand === "mastercard" && (
                        <span className="pp-brand-mc">
                          <span className="mc-l" /><span className="mc-r" />
                        </span>
                      )}
                      {brand === "amex" && <span className="pp-brand-amex">AMEX</span>}
                    </div>
                  </div>
                  <div className="pp-card-num">{cardNumber || "•••• •••• •••• ••••"}</div>
                  <div className="pp-card-row-bot">
                    <div>
                      <div className="pp-cl">Card Holder</div>
                      <div className="pp-cv">{cardName || "YOUR NAME"}</div>
                    </div>
                    <div>
                      <div className="pp-cl">Expires</div>
                      <div className="pp-cv">{expiry || "MM / YY"}</div>
                    </div>
                  </div>
                </div>

                <div className="pp-field">
                  <label className="pp-label"><User size={12} /> Name on Card</label>
                  <input
                    className={`pp-input${errors.cardName ? " err" : ""}`}
                    placeholder="Full name as on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                  {errors.cardName && <span className="pp-err"><AlertCircle size={12} />{errors.cardName}</span>}
                </div>

                <div className="pp-field">
                  <label className="pp-label"><CreditCard size={12} /> Card Number</label>
                  <input
                    className={`pp-input pp-mono${errors.cardNumber ? " err" : ""}`}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                    inputMode="numeric"
                  />
                  {errors.cardNumber && <span className="pp-err"><AlertCircle size={12} />{errors.cardNumber}</span>}
                </div>

                <div className="pp-row-2">
                  <div className="pp-field">
                    <label className="pp-label"><Calendar size={12} /> Expiry</label>
                    <input
                      className={`pp-input pp-mono${errors.expiry ? " err" : ""}`}
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      inputMode="numeric"
                    />
                    {errors.expiry && <span className="pp-err"><AlertCircle size={12} />{errors.expiry}</span>}
                  </div>
                  <div className="pp-field">
                    <label className="pp-label"><KeyRound size={12} /> CVV</label>
                    <input
                      className={`pp-input pp-mono${errors.cvv ? " err" : ""}`}
                      type="password"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      inputMode="numeric"
                    />
                    {errors.cvv && <span className="pp-err"><AlertCircle size={12} />{errors.cvv}</span>}
                  </div>
                </div>

                <div className="pp-test-hint">
                  <ShieldCheck size={12} strokeWidth={2} />
                  Test mode — card: <strong>4111 1111 1111 1111</strong> · any future expiry · any CVV
                </div>
              </div>
            )}

            {/* ── UPI ─────────────────────────────────────────────────── */}
            {activeMethod === "upi" && (
              <div className="pp-upi-form">

                <div className="pp-upi-apps">
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map((a) => (
                    <div key={a} className="pp-upi-app">{a}</div>
                  ))}
                </div>

                {/* Fixed UPI ID display box */}
                <div className="pp-upi-id-box">
                  <div className="pp-upi-id-label">
                    <Smartphone size={13} strokeWidth={2} />
                    Send payment to this UPI ID
                  </div>
                  <div className="pp-upi-id-row">
                    <span className="pp-upi-id-value">{FIXED_UPI_ID}</span>
                    <button
                      className="pp-upi-copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(FIXED_UPI_ID);
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="pp-upi-amount-row">
                    Amount to send: <strong>{formatMoney(totalCents)}</strong>
                  </div>
                </div>

                {/* Steps */}
                <div className="pp-upi-steps">
                  <p className="pp-upi-steps-title">How to pay:</p>
                  <ol className="pp-upi-steps-list">
                    <li>Open any UPI app (GPay, PhonePe, Paytm, BHIM)</li>
                    <li>Send <strong>{formatMoney(totalCents)}</strong> to <strong>{FIXED_UPI_ID}</strong></li>
                    <li>Come back here and confirm below</li>
                  </ol>
                </div>

                {/* Confirm checkbox */}
                <label className={`pp-upi-confirm${upiConfirmed ? " checked" : ""}${errors.upi ? " err" : ""}`}>
                  <input
                    type="checkbox"
                    checked={upiConfirmed}
                    onChange={(e) => { setUpiConfirmed(e.target.checked); setErrors({}); }}
                  />
                  <span>
                    I have sent <strong>{formatMoney(totalCents)}</strong> to <strong>{FIXED_UPI_ID}</strong>
                  </span>
                </label>
                {errors.upi && (
                  <span className="pp-err"><AlertCircle size={12} />{errors.upi}</span>
                )}

              </div>
            )}

            {/* ── COD ─────────────────────────────────────────────────── */}
            {activeMethod === "cod" && (
              <div className="pp-cod">
                <div className="pp-cod-icon"><Package size={40} strokeWidth={1.2} /></div>
                <p className="pp-cod-title">Pay when your order arrives</p>
                <p className="pp-cod-sub">Cash on delivery available for orders under $100.</p>
                <div className="pp-cod-steps">
                  {["Order placed", "Dispatched", "Out for delivery", "Pay on arrival"].map((s, i) => (
                    <div key={i} className="pp-cod-step">
                      <span className="pp-cod-dot">{i + 1}</span>
                      <span>{s}</span>
                      {i < 3 && <span className="pp-cod-line" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.global && (
              <div className="pp-global-err">
                <AlertCircle size={15} strokeWidth={2} />{errors.global}
              </div>
            )}

            <button
              className={`pp-pay-btn${isProcessing ? " processing" : ""}`}
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><Loader2 size={18} className="pp-spin" /> Processing…</>
              ) : (
                <>
                  <Lock size={16} strokeWidth={2.2} />
                  {activeMethod === "cod"
                    ? `Place Order · ${formatMoney(totalCents)}`
                    : activeMethod === "upi"
                      ? `Confirm Payment · ${formatMoney(totalCents)}`
                      : `Pay Securely · ${formatMoney(totalCents)}`}
                </>
              )}
            </button>

            <div className="pp-gateway-row">
              <ShieldCheck size={13} className="pp-gw-icon" />
              <span>Secured by</span>
              <span className="pp-rzp-text">razorpay</span>
              <span className="pp-dot">·</span>
              <span>256-bit SSL</span>
            </div>
          </section>

          {/* ── RIGHT: Summary ──────────────────────────────────────── */}
          <aside className="pp-summary">
            <h2 className="pp-sum-title">Order Summary</h2>
            <div className="pp-items">
              {cart.map((item) => (
                <div key={item.id ?? item.productId} className="pp-item">
                  <div className="pp-img-wrap">
                    {item.product?.image ? (
                      <img src={item.product.image} alt={item.product.name} className="pp-img" />
                    ) : (
                      <div className="pp-img-fallback"><Package size={24} strokeWidth={1.4} /></div>
                    )}
                    <span className="pp-qty-badge">{item.quantity}</span>
                  </div>
                  <div className="pp-item-info">
                    <p className="pp-item-name">{item.product?.name}</p>
                    <p className="pp-item-unit">{formatMoney(item.product?.priceCents)} × {item.quantity}</p>
                  </div>
                  <p className="pp-item-total">{formatMoney(item.product?.priceCents * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="pp-hr" />
            <div className="pp-calc">
              <div className="pp-calc-row">
                <span>Subtotal ({totalQuantity} item{totalQuantity > 1 ? "s" : ""})</span>
                <span>{formatMoney(productCostCents)}</span>
              </div>
              <div className="pp-calc-row">
                <span>Shipping &amp; handling</span>
                <span>{formatMoney(shippingCostCents)}</span>
              </div>
              <div className="pp-calc-row">
                <span>Total before tax</span>
                <span>{formatMoney(totalBeforeTax)}</span>
              </div>
              <div className="pp-calc-row">
                <span>GST / Tax (10%)</span>
                <span>{formatMoney(taxCents)}</span>
              </div>
            </div>
            <div className="pp-hr" />
            <div className="pp-total">
              <span className="pp-total-lbl">Order Total</span>
              <span className="pp-total-amt">{formatMoney(totalCents)}</span>
            </div>
            <div className="pp-trust">
              <div className="pp-trust-row"><CheckCircle2 size={13} className="pp-trust-ic" />Free returns within 30 days</div>
              <div className="pp-trust-row"><CheckCircle2 size={13} className="pp-trust-ic" />256-bit SSL encryption</div>
              <div className="pp-trust-row"><RotateCcw size={13} className="pp-trust-ic" />Secured by Razorpay</div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default PaymentPage;
