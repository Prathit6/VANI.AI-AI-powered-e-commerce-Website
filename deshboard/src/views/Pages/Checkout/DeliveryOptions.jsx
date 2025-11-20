// src/views/Pages/Checkout/DeliveryOptions.jsx
import dayjs from 'dayjs';
import api from '../../../api/api';
import { formatMoney } from '../../../utils/Money';

export function DeliveryOptions({ cartItem, deliveryOptions, loadCart }) {
  const updateDeliveryOption = async (deliveryOptionId) => {
    try {
      await api.put(`/cart-items/${cartItem.id}`, {
        deliveryOptionId: deliveryOptionId,
      });
      await loadCart();
    } catch (err) {
      console.error("Failed to update delivery option:", err);
    }
  };

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>

      {(deliveryOptions || []).map((deliveryOption) => {
        let priceString = 'FREE Shipping';

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={() => updateDeliveryOption(deliveryOption.id)}
          >
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
            />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}