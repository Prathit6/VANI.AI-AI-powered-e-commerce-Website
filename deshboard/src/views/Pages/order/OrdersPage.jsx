import { Helmet } from "react-helmet";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect, Fragment } from "react";

import "./ordersPage.css";
import { Header } from "../../../components/Header";
import { formatMoney } from "../../../utils/Money";
import { PaymentSummery } from "../../../views/Pages/Checkout/PaymentSummery"; 
 // ✅ Correct import

export function OrdersPage({ cart }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders?expand=products");
        const data = response.data;

        console.log("Orders API response:", data);

        // ✅ Normalize data shape
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {Array.isArray(orders) && orders.length > 0 ? (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-container">
                <div className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{dayjs(order.orderTimeMs).format("MMMM D")}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>{formatMoney(order.totalCostCents)}</div>
                    </div>
                  </div>

                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </div>

                <div className="order-details-grid">
                  {order.products?.map((orderProduct) => (
                    <Fragment key={orderProduct.product.id}>
                      <div className="product-image-container">
                        <img
                          src={orderProduct.product.image}
                          alt={orderProduct.product.name}
                        />
                      </div>

                      <div className="product-details">
                        <div className="product-name">
                          {orderProduct.product.name}
                        </div>
                        <div className="product-delivery-date">
                          Arriving on:{" "}
                          {dayjs(orderProduct.estimatedDeliveryTimeMs).format(
                            "MMMM D"
                          )}
                        </div>
                        <div className="product-quantity">
                          Quantity: {orderProduct.quantity}
                        </div>
                        <button className="buy-again-button button-primary">
                          <img
                            className="buy-again-icon"
                            src="images/icons/buy-again.png"
                            alt="Buy Again"
                          />
                          <span className="buy-again-message">
                            Add to Cart
                          </span>
                        </button>
                      </div>

                      <div className="product-actions">
                        <a href="/tracking">
                          <button className="track-package-button button-secondary">
                            Track package
                          </button>
                        </a>
                      </div>
                    </Fragment>
                  ))}
                </div>

                {/* Optional: show PaymentSummary for this order */}
                < PaymentSummery/>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-orders-message">No orders found.</p>
        )}
      </div>
    </>
  );
}

export default OrdersPage;
