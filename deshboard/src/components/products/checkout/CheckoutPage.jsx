import { CheckOutHeader } from "./CheckOutHeader";
import { OrderSummery } from "./OrderSummery";
import axios from "axios";
import { useEffect, useState } from "react";
// import { formatMoney } from "../../../utils/Money";
import "./checkoutPage.css";
import { PaymentSummery } from "./PaymentSummery";

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummmary, setPaymentSummary] = useState(null);

  useEffect(() => {
    // Update favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = "/cart-favicon.png";

    const fetchCheckoutData = async () => {
      try {
        let response = await axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
        setDeliveryOptions(response.data);
        
        response = await axios.get('/api/payment-summary');
        setPaymentSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch checkout data:", error);
      }
    };

    fetchCheckoutData();
  }, [cart]);

  return (
    <>
      <CheckOutHeader />
      <div className="checkout-page">
        <div className="page-title">Review your order</div>
        <div className="checkout-grid">
          <OrderSummery
            cart={cart}
            loadCart={loadCart}
            deliveryOptions={deliveryOptions}
          />
          {paymentSummmary && (
            <PaymentSummery paymentSummmary={paymentSummmary} />
          )}
        </div>
      </div>
    </>
  );
}