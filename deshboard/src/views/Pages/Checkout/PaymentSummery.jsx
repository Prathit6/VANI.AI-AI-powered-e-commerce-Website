// src/views/Pages/Checkout/PaymentSummery.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import { formatMoney } from "../../../utils/Money";
import api from "../../../api/api";
import "./checkoutPage.css"; 

export function PaymentSummery() {
  const { cart, loadCart } = useCart();
  const navigate = useNavigate();

  const createOrder = async () => {
    try {
      await api.post('/orders');
      await loadCart();
      navigate('/orders');
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!cart || cart.length === 0) {
    return <div className="payment-summary">Your cart is empty</div>;
  }

  // Calculate totals based on ALL items in cart
  const productCostCents = cart.reduce((total, item) => {
    return total + (item.product.priceCents * item.quantity);
  }, 0);

  const totalQuantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const shippingCostCents = 999; // Fixed shipping cost
  const totalBeforeTax = productCostCents + shippingCostCents;
  const taxCents = Math.round(totalBeforeTax * 0.1);
  const totalCents = totalBeforeTax + taxCents;

  return (
    <div className="payment-summary">
      <h3>Payment Summary</h3>
      
      <div className="summary-row">
        <span>Items ({totalQuantity}):</span>
        <span>{formatMoney(productCostCents)}</span>
      </div>
      
      <div className="summary-row">
        <span>Shipping & handling:</span>
        <span>{formatMoney(shippingCostCents)}</span>
      </div>
      
      <div className="summary-row">
        <span>Total before tax:</span>
        <span>{formatMoney(totalBeforeTax)}</span>
      </div>
      
      <div className="summary-row">
        <span>Estimated tax (10%):</span>
        <span>{formatMoney(taxCents)}</span>
      </div>
      
      <div className="summary-row total-row">
        <span>Order total:</span>
        <span>{formatMoney(totalCents)}</span>
      </div>
      
      <button 
        className="place-order-button button-primary"
        onClick={createOrder}
      >
        Place your order
      </button>
    </div>
  );
}