// src/context/CartProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import api from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart-items?expand=product");
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
      console.error("Failed to load cart:", err);
      setCart([]);
      setCurrentItem(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if product already exists in cart
      const existingItem = cart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // If already exists, just update quantity silently (no toast)
        await api.put(`/cart-items/${existingItem.productId}`, { 
          quantity: existingItem.quantity + quantity 
        });
      } else {
        // Add new product to cart
        await api.post("/cart-items", { productId: product.id, quantity });
      }
      
      await loadCart();
      
      // Show simple "added to cart" message
      // toast.success(`${product.name} added to cart!`);
      return { success: true };
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add item to cart");
      return { success: false };
    }
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      await api.put(`/cart-items/${productId}`, { quantity: newQuantity });
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
      await api.put(`/cart-items/${productId}`, { 
        deliveryOptionId: deliveryOptionId 
      });
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
      await api.delete(`/cart-items/${productId}`);
      
      // Update local state immediately for better UX
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
      
      // If the deleted item was the current item, update it
      if (currentItem?.productId === productId) {
        const remainingItems = cart.filter(item => item.productId !== productId);
        setCurrentItem(remainingItems.length > 0 ? remainingItems[0] : null);
      }
      
      toast.success("Item removed from cart");
      await loadCart(); // Refresh cart from server
      return true;
    } catch (err) {
      console.error("Failed to delete item:", err);
      toast.error("Failed to remove item");
      return false;
    }
  };

  // Get total quantity (sum of all item quantities)
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Get number of unique items in cart
  const getCartItemCount = () => {
    return cart.length;
  };

  useEffect(() => {
    loadCart();
  }, []);

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
        deleteCartItem
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