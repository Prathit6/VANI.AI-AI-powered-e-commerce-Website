import { 
  HomePageWrapper, 
  CheckoutPageWrapper, 
  OrdersPageWrapper, 
  TrackingPageWrapper,
  AiChatWidget,
  AdminLogin,
  AdminDashboard,  // ← Add this!
  Login,
  NotFound
} from "../../components/RouteWrappers"; // ✅ Changed path

const publicRoute = [
  {
    path: "/",
    element: <HomePageWrapper />,
  },
  {
    path: "/checkout",
    element: <CheckoutPageWrapper />,
  },
  {
    path: "/orders",
    element: <OrdersPageWrapper />,
  },
  {
    path: "/tracking",
    element: <TrackingPageWrapper />,
  },
  {
    path: "/aiassistant",
    element: <AiChatWidget />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
  path: "/admin-login",
  element: <AdminLogin />,
},
{
  path: "/admin/dashboard",
  element: <AdminDashboard />,
},
  {
    path: "*",
    element: <NotFound />,
  },
];

export default publicRoute;
