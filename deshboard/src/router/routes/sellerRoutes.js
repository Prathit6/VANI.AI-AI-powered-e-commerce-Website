import SellerDashboard from '../../views/seller/Sellerdashboard.jsx';

export const sellerRoutes = [
  { path: '/', element: <Home />, ability: ['admin', 'seller'] },
  { path: 'seller/dashboard', element: <SellerDashboard />, ability: ['seller'] },
]
