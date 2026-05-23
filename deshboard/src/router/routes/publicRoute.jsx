import {
  HomePageWrapper,
  CheckoutPageWrapper,
  OrdersPageWrapper,
  TrackingPageWrapper,
  PaymentPageWrapper,
  AiChatWidget,
  AdminLogin,
  AdminDashboard,
  Login,
  Register,
  NotFound,
} from "../../components/RouteWrappers";
import { ProtectedRoute } from "../routes/ProtectRoutes.jsx";
import SellerLogin from '../../views/auth/SellerLogin.jsx';
import SellerDashboard from '../../views/seller/Sellerdashboard.jsx';
import { lazy } from "react";

const ProductDetail = lazy(() => import("../../views/Pages/Home/Productdetailpage.jsx"));

const publicRoute = [
  { path: '/seller-login', element: <SellerLogin /> },
  { path: '/seller/dashboard', element: <SellerDashboard /> },

  // Public
  { path: "/", element: <HomePageWrapper /> },
  { path: "/products/:productId", element: <ProductDetail /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/aiassistant", element: <AiChatWidget /> },

  // Protected
  {
    path: "/checkout",
    element: <ProtectedRoute><CheckoutPageWrapper /></ProtectedRoute>,
  },
  {
    path: "/payment",
    element: <ProtectedRoute><PaymentPageWrapper /></ProtectedRoute>,
  },
  {
    path: "/orders",
    element: <ProtectedRoute><OrdersPageWrapper /></ProtectedRoute>,
  },
  {
    path: "/tracking",
    element: <ProtectedRoute><TrackingPageWrapper /></ProtectedRoute>,
  },
  { path: "*", element: <NotFound /> },
];

export default publicRoute;
