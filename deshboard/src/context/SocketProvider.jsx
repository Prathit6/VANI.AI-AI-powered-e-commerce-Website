// context/SocketProvider.jsx
// REWRITTEN — fixes timing issue where userInfo loads AFTER first effect run
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { userInfo, role: reduxRole, token: reduxToken } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  // Derive all values with multiple fallbacks
  const role = userInfo?.role || reduxRole || localStorage.getItem("role");
  const userId = userInfo?.id || userInfo?._id || null;
  const name = userInfo?.name || "";
  const token = reduxToken || localStorage.getItem("accessToken");

  useEffect(() => {
    console.log("[Socket] Effect triggered:", { role, userId, name, hasToken: !!token });

    if (!token) {
      console.log("[Socket] No token — skip");
      return;
    }

    if (role !== "admin" && role !== "seller") {
      console.log("[Socket] Role not admin/seller — skip:", role);
      return;
    }

    // ✅ CRITICAL: if userId missing, userInfo hasn't loaded yet — wait
    if (!userId) {
      console.log("[Socket] userId not ready — waiting for userInfo...");
      return;
    }

    // Already connected with same socket
    if (socketRef.current?.connected) {
      console.log("[Socket] Already connected — skip reconnect");
      return;
    }

    // Clean up old socket if exists
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log(`[Socket] Connecting as ${role} "${name}" (${userId})`);

    const newSocket = io("http://localhost:5001", {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on("connect", () => {
      console.log(`[Socket] ✅ Connected: ${newSocket.id} as ${role} (${userId})`);
      newSocket.emit("user_connected", {
        userId: String(userId),
        role,
        name,
      });
    });

    newSocket.on("admin_status", (s) => console.log("[Socket] admin_status:", s));
    newSocket.on("online_sellers", (l) => console.log("[Socket] online_sellers:", l));
    newSocket.on("disconnect", (r) => console.log("[Socket] Disconnected:", r));
    newSocket.on("connect_error", (e) => console.warn("[Socket] Error:", e.message));

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };

    // ✅ userId is the critical dep — re-runs when userInfo loads after mount
  }, [userId, role, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
