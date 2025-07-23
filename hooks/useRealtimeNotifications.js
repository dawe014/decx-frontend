import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FiBell } from "react-icons/fi";
import { useWebSocket } from "@/context/WebSocketContext"; // Adjust path as needed

export function useRealtimeNotifications() {
  const { data: session } = useSession();
  const { lastEvent } = useWebSocket(); // Use the shared context

  const [notifications, setNotifications] = useState([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Fetch initial state on component mount
  useEffect(() => {
    if (!session) return;
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user-state"); // An API route to get initial counts
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadMessageCount(data.unreadMessageCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch initial user state", error);
      }
    };
    fetchInitialData();
  }, [session]);

  // Listen for real-time events from the WebSocket context
  useEffect(() => {
    if (!lastEvent) return;

    const { type, payload } = lastEvent;

    switch (type) {
      case "new_notification":
        // This handles notifications for things other than messages if you add them,
        // or can be the primary source for message notifications on non-chat pages.
        setNotifications((prev) => [payload, ...prev]);
        toast.info(payload.message, {
          icon: <FiBell className="text-indigo-400" />,
        });
        break;

      case "unread_count_update":
        // The server is the source of truth for the unread count
        setUnreadMessageCount(payload.count);
        break;
    }
  }, [lastEvent]); // This effect re-runs whenever a new event arrives

  const markAllAsRead = async () => {
    setNotifications([]);
    // You might also want to clear notifications in the backend here
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  return { notifications, unreadMessageCount, markAllAsRead };
}
