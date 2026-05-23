import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import { formatMoney } from "../../../utils/Money";
import dayjs from "dayjs";
import "./checkoutPage.css";

// ── Checkout Header ────────────────────────────────────────────────────────────
function CheckoutHeader() {
  const { getTotalQuantity } = useCart();
  const itemCount = getTotalQuantity();

  return (
    <>
      <div className="checkout-header">
        <div className="header-content">

          {/* Left: logo + back link */}
          <div className="checkout-header-left-section">
            <Link to="/" className="checkout-header-logo">
              <span className="checkout-logo-badge">V</span>
              <span className="checkout-logo-name">
                ANI<span className="checkout-logo-dot">.</span>AI
              </span>
            </Link>
            <Link to="/home" className="products-link">← Products</Link>
          </div>

          {/* Middle: live item count */}
          <div className="checkout-header-middle-section">
            Checkout&nbsp;(
            <span className="return-to-home-link">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            )
          </div>

          <div className="checkout-header-right-section" />
        </div>
      </div>

      {/* Pushes content below fixed header */}
      <div style={{ height: '60px' }} />
    </>
  );
}
// ── Payment Summary ────────────────────────────────────────────────────────────
function PaymentSummary({ cart, selectedDelivery }) {
  const navigate = useNavigate();

  const DELIVERY_COSTS = [0, 499, 999];

  const productCost = cart.reduce(
    (total, item) => total + (item.product?.priceCents || 0) * item.quantity, 0
  );

  const shippingCost = cart.reduce((total, item) => {
    const idx = selectedDelivery[item.productId] ?? 0;
    return total + (DELIVERY_COSTS[idx] || 0);
  }, 0);

  const beforeTax = productCost + shippingCost;
  const tax = Math.round(beforeTax * 0.1);
  const total = beforeTax + tax;
  const totalQty = cart.reduce((t, i) => t + i.quantity, 0);

  return (
    <div className="payment-summary">
      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Items ({totalQty})</span>
        <span>{formatMoney(productCost)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping & handling</span>
        <span>{shippingCost === 0 ? <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span> : formatMoney(shippingCost)}</span>
      </div>
      <div className="summary-row">
        <span>Before tax</span>
        <span>{formatMoney(beforeTax)}</span>
      </div>
      <div className="summary-row">
        <span>Tax (10%)</span>
        <span>{formatMoney(tax)}</span>
      </div>

      <div className="summary-row total-row">
        <span>Order total</span>
        <span>{formatMoney(total)}</span>
      </div>

      <button
        className="place-order-button"
        onClick={() => navigate("/payment")}
      >
        Proceed to Payment →
      </button>

      <div className="secure-badge">
        🔒 Secure checkout
      </div>
    </div>
  );
}

// ── Main Checkout Page ─────────────────────────────────────────────────────────
export function CheckoutPage() {
  const { cart, updateCartItemQuantity, deleteCartItem } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/login");
  }, [navigate]);

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const deliveryOptions = [
    { label: "FREE Shipping", days: 0, cost: 0 },
    { label: "Standard", days: 3, cost: 499 },
    { label: "Express", days: 7, cost: 999 },
  ];

  const getDeliveryDate = (days) =>
    dayjs().add(days, 'day').format("ddd, MMM D");

  const handleDelete = async (productId) => {
    const item = cart.find(i => i.productId === productId);
    if (window.confirm(`Remove "${item?.product?.name}" from cart?`)) {
      await deleteCartItem(productId);
    }
  };

  // ── Empty cart ──
  if (!cart || cart.length === 0) {
    return (
      <>
        <CheckoutHeader />
        <div className="checkout-page">
          <div className="empty-cart">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CheckoutHeader />
      <div className="checkout-page">
        <div className="checkout-grid">

          {/* ── Left: Cart Items ── */}
          <div className="cart-items-section">
            <h2 className="page-title">Review your order</h2>

            {cart.map((item) => {
              const selectedIdx = selectedDelivery[item.productId] ?? 0;
              const selectedOpt = deliveryOptions[selectedIdx];

              return (
                <div key={item.productId} className="cart-item-container">
                  {/* Delivery date tag */}
                  <div className="delivery-date">
                    Arrives {getDeliveryDate(selectedOpt.days)} — {selectedOpt.label}
                  </div>

                  <div className="cart-item-details-grid">
                    {/* Image */}
                    <img
                      className="product-image"
                      src={item.product?.image || "/images/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      onError={e => { e.target.src = "/images/placeholder.png"; }}
                    />

                    {/* Info */}
                    <div className="cart-item-details">
                      <div className="product-name">
                        {item.product?.name || "Unknown Product"}
                      </div>
                      <div className="product-price">
                        {formatMoney(item.product?.priceCents || 0)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 2 }}>
                        Subtotal: {formatMoney((item.product?.priceCents || 0) * item.quantity)}
                      </div>

                      <div className="product-quantity">
                        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Qty:</span>
                        <select
                          className="quantity-selector"
                          value={item.quantity}
                          onChange={e => updateCartItemQuantity(item.productId, Number(e.target.value))}
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <span
                          className="delete-quantity-link"
                          onClick={() => handleDelete(item.productId)}
                        >
                          Remove
                        </span>
                      </div>
                    </div>

                    {/* Delivery options */}
                    <div className="delivery-options">
                      <div className="delivery-options-title">Delivery</div>
                      {deliveryOptions.map((opt, idx) => (
                        <label key={idx} className="delivery-option" style={{ cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={`delivery-${item.productId}`}
                            checked={selectedIdx === idx}
                            onChange={() => setSelectedDelivery(prev => ({
                              ...prev,
                              [item.productId]: idx
                            }))}
                          />
                          <div>
                            <div className="delivery-option-date">
                              {getDeliveryDate(opt.days)}
                            </div>
                            <div className="delivery-option-price">
                              {opt.cost === 0
                                ? <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
                                : formatMoney(opt.cost)
                              } — {opt.label}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: Payment Summary ── */}
          <div className="payment-summary-section">
            <PaymentSummary cart={cart} selectedDelivery={selectedDelivery} />
          </div>

        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
