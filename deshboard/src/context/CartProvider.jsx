import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import api from "../api/api";

const CartContext = createContext();

const DEFAULT_DELIVERY_OPTION_ID = "1";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Use Redux auth state as single source of truth
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = token || localStorage.getItem("accessToken");

  const loadCart = async () => {
    // ✅ Don't even try to load if not logged in
    if (!isLoggedIn) {
      setCart([]);
      setCurrentItem(null);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/cart-items?expand=product", {
        withCredentials: true,
      });
      const cartData = response.data.map((item) => ({
        ...item,
        product: item.product || {},
      }));
      setCart(cartData);

      if (cartData.length > 0 && !currentItem) {
        setCurrentItem(cartData[0]);
      } else if (cartData.length === 0) {
        setCurrentItem(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setCart([]);
        setCurrentItem(null);
      } else {
        console.error("Failed to load cart:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    // ✅ Strict login check — redirect to login if not logged in
    if (!isLoggedIn) {
      toast.error("Please login to add items to your cart.");
      window.location.href = "/login";
      return { success: false };
    }

    try {
      const existingItem = cart.find(item => item.productId === product.id);

      if (existingItem) {
        await api.patch(
          `/cart-items/${existingItem.id}`,
          { quantity: existingItem.quantity + quantity },
          { withCredentials: true }
        );
      } else {
        await api.post(
          "/cart-items",
          {
            productId: product.id,
            quantity,
            deliveryOptionId: DEFAULT_DELIVERY_OPTION_ID,
          },
          { withCredentials: true }
        );
      }

      await loadCart();
      toast.success(`${product.name} added to cart!`);
      return { success: true };
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Please login to add items to your cart.");
        window.location.href = "/login";
      } else {
        toast.error("Failed to add item to cart");
      }
      return { success: false };
    }
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const cartItem = cart.find(item => item.productId === productId);
      if (!cartItem) return false;

      await api.patch(
        `/cart-items/${cartItem.id}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      await loadCart();
      toast.success("Quantity updated");
      return true;
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity");
      return false;
    }
  };

  const updateDeliveryOption = async (productId, deliveryOptionId) => {
    try {
      const cartItem = cart.find(item => item.productId === productId);
      if (!cartItem) return false;

      await api.patch(
        `/cart-items/${cartItem.id}`,
        { deliveryOptionId },
        { withCredentials: true }
      );
      await loadCart();
      toast.success("Delivery option updated");
      return true;
    } catch (err) {
      console.error("Failed to update delivery option:", err);
      toast.error("Failed to update delivery option");
      return false;
    }
  };

  const deleteCartItem = async (productId) => {
    try {
      const cartItem = cart.find(item => item.productId === productId);
      if (!cartItem) return false;

      await api.delete(`/cart-items/${cartItem.id}`, { withCredentials: true });

      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
      if (currentItem?.productId === productId) {
        const remaining = cart.filter(item => item.productId !== productId);
        setCurrentItem(remaining.length > 0 ? remaining[0] : null);
      }

      toast.success("Item removed from cart");
      await loadCart();
      return true;
    } catch (err) {
      console.error("Failed to delete item:", err);
      toast.error("Failed to remove item");
      return false;
    }
  };

  const getTotalQuantity = () =>
    cart.reduce((total, item) => total + (item.quantity || 0), 0);

  const getCartItemCount = () => cart.length;

  // ✅ Reload cart whenever login state changes
  useEffect(() => {
    loadCart();
  }, [isLoggedIn]);

  return (
    <CartContext.Provider
      value={{
        cart,
        currentItem,
        loading,
        loadCart,
        addToCart,
        setCurrentItem,
        getTotalQuantity,
        getCartItemCount,
        updateCartItemQuantity,
        updateDeliveryOption,
        deleteCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
