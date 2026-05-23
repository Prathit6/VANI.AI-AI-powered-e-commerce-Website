import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, userInfo, loader } = useSelector((state) => state.auth);
  const role = userInfo?.role?.toLowerCase() || 'user'; // ✅ same as Header.jsx
  const location = useLocation();

  if (loader) return null;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'seller') return <Navigate to="/seller/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
