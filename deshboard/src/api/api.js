import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

// Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Only redirect to login on 401 for protected actions
// Cart and product routes are public — silently fail, don't redirect
const PUBLIC_ROUTES = ['/cart-items', '/products', '/delivery-options'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isPublicRoute = PUBLIC_ROUTES.some((route) => url.includes(route));

      if (!isPublicRoute) {
        // Protected action failed (e.g. place order) → redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      // Public/cart 401 → CartProvider handles it silently
    }
    return Promise.reject(error);
  }
);

// ── Image URL helper ──────────────────────────────────────────────────────────
// Images live at localhost:3000/images/... (NOT under /api)
// Usage in any component: <img src={getImageUrl(product.image)} />
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const clean = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';
return `${base}/${clean}`;
};

export default api;
