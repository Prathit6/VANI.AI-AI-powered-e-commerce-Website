import { Link } from "react-router-dom";
import "./checkOutHeader.css";

export function CheckOutHeader() {
  return (
    <div className="checkout-header">
      <div className="header-content">
        <div className="checkout-header-left-section">
          <Link to="/" className="checkout-logo-container">
            <span className="logo-square">V</span>
            <span className="logo-text">ANI.AI</span>
          </Link>
          <Link to="/" className="products-link">
            Products
          </Link>
        </div>

        <div className="checkout-header-middle-section">
          Checkout (
          <Link className="return-to-home-link" to="/">
            3 items
          </Link>
          )
        </div>

        <div className="checkout-header-right-section"></div>
      </div>
    </div>
  );
}