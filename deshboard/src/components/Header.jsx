// src/components/Header.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../context/CartProvider";
import "./Header.css";

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { getTotalQuantity } = useCart();

  // This shows the total quantity (sum of all quantities)
  // If you want to show unique item count instead, use getCartItemCount()
  const totalQuantity = getTotalQuantity();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  const user = userInfo
    ? {
        id: userInfo.id || "user123",
        name: userInfo.name || "Guest User",
        dp: userInfo.dp || "/images/default-avatar.png",
      }
    : null;

  return (
    <div className="header">
      <div className="left-section">
        <NavLink to="/" className="header-link">
          <span className="logo-text">
            <span className="logo-square">V</span>ANI.AI
          </span>
        </NavLink>
      </div>

      <div className="middle-section">
        <input className="search-bar" placeholder="Search products..." />
        <button className="search-button">
          <img className="search-icon" src="/images/icons/search-icon.png" alt="search" />
        </button>
      </div>

      <div className="right-section">
        <NavLink className="header-link" to="/aiassistant">AI Assistant</NavLink>
        <NavLink className="header-link" to="/orders">Orders</NavLink>
        
        <NavLink className="header-link cart-link" to="/checkout">
          <img className="cart-icon" src="/images/icons/cart-icon.png" alt="cart" />
          {totalQuantity > 0 && (
            <div className="cart-quantity">{totalQuantity}</div>
          )}
          <div className="cart-text">Cart</div>
        </NavLink>

        {!user ? (
          <NavLink to="/login" className="header-link">
            <button className="login-btn">Login</button>
          </NavLink>
        ) : (
          <div className="user-container" style={{ position: "relative" }}>
            <div 
              className="user-info" 
              onClick={toggleDropdown} 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                cursor: "pointer" 
              }}
            >
              <img 
                src={user.dp} 
                alt="user-dp" 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: "50%", 
                  objectFit: "cover", 
                  marginBottom: 5 
                }} 
              />
              <span style={{ color: "#fff", fontSize: "0.9rem" }}>{user.name}</span>
            </div>

            {showDropdown && (
              <div className="user-dropdown">
                <p><strong>ID:</strong> {user.id}</p>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}