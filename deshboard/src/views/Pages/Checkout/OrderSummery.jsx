// src/pages / Checkout / OrderSummery.jsx
import dayjs from "dayjs";
import { useCart } from "../../../context/CartProvider";
import { formatMoney } from "../../../utils/Money";
import { DeliveryOptions } from "./DeliveryOptions";

export function OrderSummery({ deliveryOptions }) {
  const { cart, deleteCartItem } = useCart();

  if (!cart || cart.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="order-summary">
      {cart.map((cartItem) => {
        const selectedDeliveryOption = deliveryOptions?.find(
          (option) => option.id === cartItem.deliveryOptionId
        );

        const handleDelete = async () => {
          const confirmed = window.confirm(
            `Remove "${cartItem.product?.name}" from cart?`
          );
          if (confirmed) {
            await deleteCartItem(cartItem.productId);
          }
        };

        return (
          <div key={cartItem.productId} className="cart-item-container">
            <div className="delivery-date">
              Delivery date:{" "}
              {selectedDeliveryOption
                ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )
                : "Not selected"}
            </div>

            <div className="cart-item-details-grid">
              <img
                className="product-image"
                src={cartItem.product?.image || "/images/placeholder.png"}
                alt={cartItem.product?.name ?? "Unknown Product"}
              />

              <div className="cart-item-details">
                <div className="product-name">
                  {cartItem.product?.name ?? "Unknown Product"}
                </div>
                <div className="product-price">
                  {formatMoney(cartItem.product?.priceCents ?? 0)}
                </div>
                <div className="product-quantity">
                  <span>
                    Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                  </span>
                  <span
                    className="update-quantity-link link-primary"
                    onClick={() => alert("Implement quantity update here")}
                  >
                    Update
                  </span>
                  <span
                    className="delete-quantity-link link-primary"
                    onClick={handleDelete}
                  >
                    Delete
                  </span>
                </div>
              </div>

              <DeliveryOptions
                deliveryOptions={deliveryOptions}
                cartItem={cartItem}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
