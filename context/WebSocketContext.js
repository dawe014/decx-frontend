"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null); // Stores the most recent event

  const connect = useCallback(() => {
    if (!session || !session.user || status !== "authenticated") {
      return;
    }

    // Close existing connection if any
    if (ws) {
      ws.close();
    }

    const connectionURL = `${
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080"
    }?token=${session.user.id}`;

    const newWs = new WebSocket(connectionURL);

    newWs.onopen = () => {
      setIsConnected(true);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // We update a single state with the latest event.
        // Components will use useEffect to react to this change.
        setLastEvent({ ...data, timestamp: new Date().getTime() });
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    newWs.onclose = () => {
      setIsConnected(false);
      console.warn("WebSocket connection closed. Attempting to reconnect...");

      setTimeout(connect, 5000); // Try to reconnect after 5 seconds
    };

    newWs.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsConnected(false);
    };

    setWs(newWs);
  }, [session, status, ws]);

  useEffect(() => {
    if (status === "authenticated") {
      connect();
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]); // Only re-run when session status changes

  const sendMessage = (type, payload) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, ...payload }));
    } else {
      console.error("Cannot send message, WebSocket is not open.");
    }
  };

  const value = {
    ws,
    isConnected,
    lastEvent,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
