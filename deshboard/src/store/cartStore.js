// src/context/CartProvider.jsx
import { create } from "zustand";
import api from "../api/api"; // Use your axios instance

export const useCartStore = create((set, get) => ({
  cart: [],        // Cart items
  loading: false,  // Loading state

  // Load cart items from backend
  loadCart: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/cart-items"); // ✅ Correct endpoint
      // Ensure we always have an array
      set({ cart: Array.isArray(response.data) ? response.data : [], loading: false });
    } catch (error) {
      console.error("Failed to load cart:", error);
      set({ cart: [], loading: false });
    }
  },

  // Add item to cart
  addToCart: async (product, quantity = 1) => {
    try {
      if (!product?.id) throw new Error("Invalid product");
      await api.post("/cart-items", { productId: product.id, quantity });
      await get().loadCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      if (!productId) throw new Error("Invalid productId");
      await api.delete(`/cart-items/${productId}`);
      await get().loadCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  },
}));

// ✅ Optional: You can call get().loadCart() once after initialization
// to pre-load cart automatically if needed.
