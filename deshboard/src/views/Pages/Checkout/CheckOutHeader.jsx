// src/components/CheckOutHeader.jsx
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import "./checkOutHeader.css";

export function CheckOutHeader() {
  const { getCartItemCount } = useCart();
  
  // Get number of unique items, not total quantity
  const itemCount = getCartItemCount();

  return (
    <div className="checkout-header">
      <div className="header-content">
        <div className="checkout-header-left-section">
          <Link to="/" className="checkout-logo-container">
            <span className="logo-square">V</span>
            <span className="logo-text">ANI.AI</span>
          </Link>
          <Link to="/" className="products-link">Products</Link>
        </div>

        <div className="checkout-header-middle-section">
          Checkout (
          <Link className="return-to-home-link" to="/checkout">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Link>
          )
        </div>

        <div className="checkout-header-right-section"></div>
      </div>
    </div>
  );
}