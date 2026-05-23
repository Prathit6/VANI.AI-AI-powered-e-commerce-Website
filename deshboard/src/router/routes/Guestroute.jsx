import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
  const { token, role, loader } = useSelector((state) => state.auth);

  if (loader) return null;

  if (token) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'seller') return <Navigate to="/seller/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
