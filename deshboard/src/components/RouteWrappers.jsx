import { lazy } from "react";
import { useCart } from "../context/CartProvider";

// Lazy imports
export const HomePage = lazy(() => 
  import("../views/Pages/Home/HomePage").then(module => ({ 
    default: module.HomePage || module.default 
  }))
);

export const CheckoutPage = lazy(() => 
  import("../views/Pages/Checkout/CheckoutPage").then(module => ({ 
    default: module.CheckoutPage || module.default 
  }))
);
export const AdminDashboard = lazy(() => 
  import("../views/admin/AdminDashboard")
);

export const AdminLogin = lazy(() => 
  import("../views/auth/AdminLogin").then(module => ({ 
    default: module.default 
  }))
);

export const OrdersPage = lazy(() => 
  import("../views/Pages/order/OrdersPage").then(module => ({ 
    default: module.OrdersPage || module.default 
  }))
);

export const TrackingPage = lazy(() => 
  import("../views/Pages/order/TrackingPage").then(module => ({ 
    default: module.TrackingPage || module.default 
  }))
);

export const AiChatWidget = lazy(() => import("../components/AiChatWidget"));
export const Login = lazy(() => import("../views/auth/Login"));
export const NotFound = lazy(() => import("../NotFound"));

// Component Wrappers
export const HomePageWrapper = () => {
  const { cart, loadCart } = useCart();
  return <HomePage cart={cart} loadCart={loadCart} />;
};

export const CheckoutPageWrapper = () => {
  const { cart, loadCart } = useCart();
  return <CheckoutPage cart={cart} loadCart={loadCart} />;
};

export const OrdersPageWrapper = () => {
  const { cart } = useCart();
  return <OrdersPage cart={cart} />;
};

export const TrackingPageWrapper = () => {
  return <TrackingPage />;
};