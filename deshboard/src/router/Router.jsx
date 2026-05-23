import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import ProtectedRoute from './routes/ProtectRoutes';
import GuestRoute from './routes/Guestroute';

const Home = lazy(() => import('../views/Pages/Home/HomePage.jsx'));
const ProductDetail = lazy(() => import('../views/Pages/Home/Productdetailpage.jsx'));
const Login = lazy(() => import('../views/auth/Login'));
const Register = lazy(() => import('../views/auth/Register'));
const AdminLogin = lazy(() => import('../views/auth/AdminLogin'));
const SellerLogin = lazy(() => import('../views/auth/SellerLogin'));
const AdminDashboard = lazy(() => import('../views/admin/AdminDashboard.jsx'));
const SellerDashboard = lazy(() => import('../views/seller/Sellerdashboard.jsx'));
const CheckoutPage = lazy(() => import('../views/Pages/Checkout/CheckoutPage.jsx'));
const PaymentPage = lazy(() =>
  import('../views/Pages/Checkout/PaymentPage.jsx').then(m => ({ default: m.PaymentPage }))
);
const OrdersPage = lazy(() => import('../views/Pages/order/OrdersPage.jsx'));
const TrackingPage = lazy(() =>
  import('../views/Pages/order/TrackingPage.jsx').then(m => ({ default: m.TrackingPage }))
);
const LandingPage = lazy(() => import('../views/Pages/Landing/LandingPage.jsx'));

const PageLoader = () => (
  <div style={{
    minHeight: '100vh', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#999', fontSize: '0.9rem', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  }}>
    Loading...
  </div>
);

// Must be INSIDE BrowserRouter to use useLocation
const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideHeader = ['/checkout', '/payment'].includes(location.pathname);
  return (
    <>
      {!hideHeader && <Header />}
      <div style={{ marginTop: hideHeader ? '0' : '64px' }}>
        {children}
      </div>
    </>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products/:productId" element={<ProductDetail />} />

            {/* Guest only */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/admin-login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
            <Route path="/seller-login" element={<GuestRoute><SellerLogin /></GuestRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />

            {/* Seller */}
            <Route path="/seller/dashboard" element={
              <ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>
            } />

            {/* Protected */}
            <Route path="/checkout" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'seller']}><CheckoutPage /></ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'seller']}><PaymentPage /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'seller']}><OrdersPage /></ProtectedRoute>
            } />
            <Route path="/tracking" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'seller']}><TrackingPage /></ProtectedRoute>
            } />

            {/* Wildcard last */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
