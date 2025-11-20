// src/pages/Home/Product.jsx
import { useState } from "react";
import { useCart } from "../../../context/CartProvider";
import { formatMoney } from "../../../utils/Money";
import "../../../index.css";

export function Product({ product, loadCart }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    
    if (success) {
      setShowNotification(true);
      loadCart(); // update cart in header
      
      // Hide notification after 3s
      setTimeout(() => setShowNotification(false), 3000);
      
      // Reset quantity to 1 after adding
      setQuantity(1);
    }
  };

  return (
    <>
      {/* Toast Notification - Top Right */}
      {showNotification && (
        <div className="toast-notification-right">
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <div className="toast-title">Added to Cart!</div>
            <div className="toast-message">{product.name}</div>
          </div>
        </div>
      )}

      <div className="product-container">
        <div className="product-image-container">
          <img className="product-image" src={product.image} alt={product.name} />
        </div>

        <div className="product-name">{product.name}</div>

        <div className="product-rating-container">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className={i < (product.rating?.stars || 0) ? "star filled" : "star"}
              >
                ★
              </span>
            ))}
          <span className="product-rating-count">
            {product.rating?.count || 0}
          </span>
        </div>

        <div className="product-price">{formatMoney(product.priceCents)}</div>

        <div className="product-quantity-container">
          <select 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="product-spacer"></div>

        <button 
          className="add-to-cart-button button-primary" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </>
  );
}