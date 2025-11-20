// src/views/Pages/Checkout/CheckoutPage.jsx
import { useState } from "react";
import { useCart } from "../../../context/CartProvider";
import { CheckOutHeader } from "./CheckOutHeader";
import { PaymentSummery } from "./PaymentSummery";
import { formatMoney } from "../../../utils/Money";
import dayjs from "dayjs";
import "./checkoutPage.css";

export function CheckoutPage() {
  const { cart, updateCartItemQuantity, deleteCartItem } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState({});

  const handleUpdateQuantity = async (productId, newQuantity) => {
    await updateCartItemQuantity(productId, newQuantity);
  };

  const handleDelete = async (productId) => {
    const cartItem = cart.find(item => item.productId === productId);
    const confirmed = window.confirm(
      `Remove "${cartItem?.product?.name}" from cart?`
    );
    
    if (confirmed) {
      await deleteCartItem(productId);
    }
  };

  const getDeliveryDates = () => {
    const today = dayjs();
    return [
      { date: today.format("dddd, MMMM D"), cost: 0, label: "FREE Shipping" },
      { date: today.add(3, 'day').format("dddd, MMMM D"), cost: 499, label: "$4.99 - Shipping" },
      { date: today.add(7, 'day').format("dddd, MMMM D"), cost: 999, label: "$9.99 - Shipping" }
    ];
  };

  if (!cart || cart.length === 0) {
    return (
      <>
        <CheckOutHeader />
        <div className="checkout-page">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <a href="/" className="button-primary continue-shopping-btn">
              Continue Shopping
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CheckOutHeader />
      <div className="checkout-page">
        <div className="checkout-grid">
          {/* Left side - Cart items */}
          <div className="cart-items-section">
            <h2 className="page-title">Review your order</h2>
            
            {cart.map((item) => (
              <div key={item.productId} className="cart-item-container">
                <div className="delivery-date">
                  Delivery date: {dayjs().format("dddd, MMMM D")}
                </div>

                <div className="cart-item-details-grid">
                  <img 
                    className="product-image" 
                    src={item.product.image} 
                    alt={item.product.name}
                  />

                  <div className="cart-item-details">
                    <div className="product-name">{item.product.name}</div>
                    <div className="product-price">
                      {formatMoney(item.product.priceCents)}
                    </div>
                    
                    <div className="product-quantity">
                      <span>Quantity: </span>
                      <select
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.productId, Number(e.target.value))}
                        className="quantity-selector"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <span 
                        className="delete-quantity-link link-primary"
                        onClick={() => handleDelete(item.productId)}
                      >
                        Delete
                      </span>
                    </div>
                  </div>

                  <div className="delivery-options">
                    <div className="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    {getDeliveryDates().map((option, idx) => (
                      <div key={idx} className="delivery-option">
                        <input
                          type="radio"
                          name={`delivery-option-${item.productId}`}
                          checked={selectedDelivery[item.productId] === idx || (selectedDelivery[item.productId] === undefined && idx === 0)}
                          onChange={() => setSelectedDelivery({
                            ...selectedDelivery,
                            [item.productId]: idx
                          })}
                        />
                        <div>
                          <div className="delivery-option-date">{option.date}</div>
                          <div className="delivery-option-price">{option.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Payment summary */}
          <div className="payment-summary-section">
            <PaymentSummery selectedDelivery={selectedDelivery} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;