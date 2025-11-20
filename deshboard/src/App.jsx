import { useState } from "react";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from "react-hot-toast";
import "./App.css";
import { Header } from "./components/Header";
import RouterComponent from "./router/Router.jsx";
import publicRoute from "./router/routes/publicRoute.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import authReducer from "./store/Reducers/authReducer";

// Create Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

function App() {
  const [allRoutes] = useState([...publicRoute]);
  
  return (
    <Provider store={store}>
      <CartProvider>
       
        <Header />
        <div style={{ marginTop: "80px" }}>
          <RouterComponent allRoutes={allRoutes} />
        </div>
      </CartProvider>
    </Provider>
  );
}

export default App;