// src/App.js
import { useEffect } from 'react';
import { useDispatch, Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from 'react-hot-toast';
import './App.css';
import authReducer, { get_user_info } from './store/Reducers/authReducer';
import { CartProvider } from './context/CartProvider';
import { SocketProvider } from './context/SocketProvider';
import AppRouter from './router/Router';
import StoreNotificationPopup from './components/StoreNotificationPopup';
// ✅ FloatingChatBot removed from here — it's inside Router.jsx (needs BrowserRouter context)

const store = configureStore({
  reducer: { auth: authReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      dispatch(get_user_info()).unwrap().catch(() => { });
    }
  }, [dispatch]);

  return (
    <CartProvider>
      <StoreNotificationPopup
        storeName="YourStore.com"
        logoSrc="/logo.png"
        delayMs={2000}
        storageKey="store_notif_v1"
        onAllow={() => console.log('User subscribed!')}
      />
      <SocketProvider>
        <AppRouter />
      </SocketProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
          },
        }}
      />
    </CartProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
