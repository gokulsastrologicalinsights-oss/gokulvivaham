"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Initial fetch
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data);
      }
    };

    fetchNotifications();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
            );
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    
    try {
      await markNotificationAsRead(id);
    } catch (e) {
      console.error(e);
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    // Optimistic update
    const previous = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    
    try {
      await markAllNotificationsAsRead();
    } catch (e) {
      console.error(e);
      setNotifications(previous);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-rose-600 focus:outline-none transition-colors rounded-full hover:bg-rose-50"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full border border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-80 mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm flex flex-col items-center justify-center gap-2">
                <Bell className="w-8 h-8 text-gray-200" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id, notification.is_read)}
                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.is_read ? "bg-rose-50/30" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-snug">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
            <button 
              onClick={() => {
                setIsOpen(false);
                // router.push('/notifications'); // If we have a dedicated page later
              }}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 w-full p-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
