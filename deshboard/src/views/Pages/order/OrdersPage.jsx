import { Helmet } from "react-helmet";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatMoney } from "../../../utils/Money";

// ─── Axios instance ───────────────────────────────────────────────────────────
const shopApi = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconBox = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconLoader = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: "orders-spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  delivered: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", label: "Delivered" },
  shipped: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", label: "Shipped" },
  processing: { bg: "#fefce8", color: "#854d0e", border: "#fef08a", label: "Processing" },
  cancelled: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", label: "Cancelled" },
  pending: { bg: "#f9fafb", color: "#374151", border: "#e5e7eb", label: "Pending" },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 12,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 20,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      letterSpacing: "0.01em",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: s.color, display: "inline-block",
      }} />
      {s.label}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await shopApi.get("/api/orders?expand=products");
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load your orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [navigate]);

  return (
    <>
      <Helmet><title>My Orders — VANI.AI</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes orders-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orders-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .orders-page {
          min-height: 100vh;
          background: #f9f9f8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding-bottom: 80px;
        }

        /* ── Top bar ── */
        .orders-topbar {
          background: #fff;
          border-bottom: 1px solid #e8e8e4;
          padding: 20px 0;
        }
        .orders-topbar-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .orders-back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid #e8e8e4;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #52525b;
          cursor: pointer;
          transition: all .18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none;
        }
        .orders-back-btn:hover { background: #f4f4f5; border-color: #d4d4d0; color: #000; }

        .orders-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #111;
          font-weight: 400;
          flex: 1;
        }
        .orders-count {
          font-size: 12px;
          font-weight: 600;
          color: #a1a1aa;
          background: #f4f4f5;
          padding: 4px 10px;
          border-radius: 20px;
        }

        /* ── Body ── */
        .orders-body {
          max-width: 900px;
          margin: 32px auto 0;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Order card ── */
        .order-card {
          background: #fff;
          border: 1px solid #e8e8e4;
          border-radius: 14px;
          overflow: hidden;
          animation: orders-fadein .35s ease both;
        }
        .order-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f4f4f5;
          flex-wrap: wrap;
          gap: 12px;
        }
        .order-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .order-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .order-meta-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #a1a1aa;
        }
        .order-meta-value {
          font-size: 13px;
          font-weight: 600;
          color: #18181b;
        }
        .order-id-value {
          font-size: 12px;
          font-family: "SF Mono", "Fira Code", monospace;
          color: #71717a;
          background: #f9f9f8;
          padding: 2px 8px;
          border-radius: 5px;
          border: 1px solid #e8e8e4;
        }

        /* ── Products in order ── */
        .order-products { padding: 8px 0; }

        .order-product-row {
          display: grid;
          grid-template-columns: 72px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid #f9f9f8;
          transition: background .15s;
        }
        .order-product-row:last-child { border-bottom: none; }
        .order-product-row:hover { background: #fafaf9; }

        .order-product-img {
          width: 72px;
          height: 72px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #e8e8e4;
          background: #f4f4f5;
        }
        .order-product-img-placeholder {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          border: 1px solid #e8e8e4;
          background: #f4f4f5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4d4d0;
        }

        .order-product-info { display: flex; flex-direction: column; gap: 5px; }
        .order-product-name {
          font-size: 14px;
          font-weight: 600;
          color: #18181b;
          line-height: 1.4;
        }
        .order-product-qty {
          font-size: 12px;
          color: #71717a;
          font-weight: 500;
        }
        .order-product-delivery {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #52525b;
          font-weight: 500;
        }

        .order-product-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }
        .order-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s;
          white-space: nowrap;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none;
          border: none;
        }
        .order-action-btn.primary {
          background: #18181b;
          color: #fff;
        }
        .order-action-btn.primary:hover { background: #3f3f46; }
        .order-action-btn.secondary {
          background: transparent;
          color: #52525b;
          border: 1px solid #e4e4e7;
        }
        .order-action-btn.secondary:hover { background: #f4f4f5; color: #000; border-color: #d4d4d0; }

        /* ── Empty / loading states ── */
        .orders-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 80px 24px;
          color: #a1a1aa;
          text-align: center;
        }
        .orders-empty-icon { color: #d4d4d0; }
        .orders-empty-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.25rem;
          color: #52525b;
          font-weight: 400;
        }
        .orders-empty-sub {
          font-size: 13px;
          color: #a1a1aa;
          max-width: 280px;
          line-height: 1.6;
        }
        .orders-empty-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 10px 20px;
          background: #18181b;
          color: #fff;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background .18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .orders-empty-cta:hover { background: #3f3f46; }

        .orders-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 80px 24px;
          color: #a1a1aa;
          font-size: 13px;
          font-weight: 500;
        }

        .orders-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .orders-error-text {
          font-size: 13px;
          color: #991b1b;
          font-weight: 500;
        }
        .orders-retry-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #fff;
          border: 1px solid #fecaca;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          color: #991b1b;
          cursor: pointer;
          transition: all .18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        }
        .orders-retry-btn:hover { background: #fef2f2; }

        @media (max-width: 600px) {
          .order-card-header { flex-direction: column; align-items: flex-start; }
          .order-product-row { grid-template-columns: 56px 1fr; }
          .order-product-actions { grid-column: 1 / -1; flex-direction: row; }
          .order-product-img { width: 56px; height: 56px; }
        }
      `}</style>

      <div className="orders-page">
        {/* Top bar */}
        <div className="orders-topbar">
          <div className="orders-topbar-inner">
            <Link to="/home" className="orders-back-btn">
              <IconArrowLeft />
              Back
            </Link>
            <h1 className="orders-title">My Orders</h1>
            {!loading && !error && (
              <span className="orders-count">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="orders-body">

          {/* Loading */}
          {loading && (
            <div className="orders-loading">
              <IconLoader />
              Loading your orders...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="orders-error">
              <span className="orders-error-text">{error}</span>
              <button className="orders-retry-btn" onClick={fetchOrders}>
                <IconRefresh />
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div className="orders-empty">
              <div className="orders-empty-icon">
                <IconBox />
              </div>
              <div className="orders-empty-title">No orders yet</div>
              <p className="orders-empty-sub">
                When you place your first order it will show up here.
              </p>
              <Link to="/home" className="orders-empty-cta">
                Start Shopping
              </Link>
            </div>
          )}

          {/* Orders list */}
          {!loading && !error && orders.map((order, idx) => (
            <div
              key={order.id}
              className="order-card"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Card header */}
              <div className="order-card-header">
                <div className="order-meta">
                  <div className="order-meta-item">
                    <span className="order-meta-label">Order placed</span>
                    <span className="order-meta-value">
                      {dayjs(order.orderTimeMs).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <div className="order-meta-item">
                    <span className="order-meta-label">Total</span>
                    <span className="order-meta-value">
                      {formatMoney(order.totalCostCents)}
                    </span>
                  </div>
                  <div className="order-meta-item">
                    <span className="order-meta-label">Order ID</span>
                    <span className="order-id-value">{order.id}</span>
                  </div>
                </div>
                {order.status && <StatusBadge status={order.status} />}
              </div>

              {/* Products */}
              <div className="order-products">
                {order.products?.map((orderProduct, i) => (
                  <div key={orderProduct.product?.id ?? i} className="order-product-row">

                    {/* Image */}
                    {orderProduct.product?.image ? (
                      <img
                        className="order-product-img"
                        src={orderProduct.product.image}
                        alt={orderProduct.product?.name}
                      />
                    ) : (
                      <div className="order-product-img-placeholder">
                        <IconBox />
                      </div>
                    )}

                    {/* Info */}
                    <div className="order-product-info">
                      <div className="order-product-name">
                        {orderProduct.product?.name || "Product"}
                      </div>
                      <div className="order-product-qty">
                        Qty: {orderProduct.quantity}
                      </div>
                      {orderProduct.estimatedDeliveryTimeMs && (
                        <div className="order-product-delivery">
                          <IconMapPin />
                          Est. delivery {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMM D, YYYY")}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="order-product-actions">
                      <button className="order-action-btn primary">
                        <IconRefresh />
                        Buy Again
                      </button>
                      <Link to="/tracking" className="order-action-btn secondary">
                        <IconMapPin />
                        Track
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
}

export default OrdersPage;
