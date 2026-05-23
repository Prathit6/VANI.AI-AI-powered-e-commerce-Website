import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import "./checkOutHeader.css";

export function CheckOutHeader() {
  const { getTotalQuantity } = useCart();
  const itemCount = getTotalQuantity();

  return (
    <>
      <div className="checkout-header">
        <div className="header-content">

          {/* Left: matching logo + back link */}
          <div className="checkout-header-left-section">
            <Link to="/" className="checkout-header-logo">
              <span className="checkout-logo-badge">V</span>
              <span className="checkout-logo-name">
                ANI<span className="checkout-logo-dot">.</span>AI
              </span>
            </Link>
            <Link to="/home" className="products-link">← Products</Link>
          </div>

          {/* Middle: item count */}
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

      {/* Spacer so page content isn't hidden behind fixed header */}
      <div style={{ height: '60px' }} />
    </>
  );
}
