"use client";

import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { getUserNotifications, markNotificationRead, markAllNotificationsRead } from "../actions";
import { useRouter } from "next/navigation";

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifs = async () => {
      const notifs = await getUserNotifications(userId, { limit: 10 });
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.isRead).length);
    };
    fetchNotifs();
  }, [userId, open]);

  // Handle clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id, userId);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = async (n: any) => {
    if (!n.isRead) {
      await handleMarkRead(n.id);
    }
    setOpen(false);
    if (n.linkUrl) {
      router.push(n.linkUrl);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(!open)}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-2 h-2 w-2 bg-destructive rounded-full" />
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-card border rounded-md shadow-lg z-50 overflow-hidden flex flex-col">
          <div className="p-3 border-b flex items-center justify-between bg-muted/50">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" onClick={handleMarkAllRead}>
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No new notifications
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors flex gap-3 ${
                      !n.isRead ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm ${!n.isRead ? "font-semibold" : "font-medium"}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <div className="h-2 w-2 bg-primary rounded-full mt-1 shrink-0"></div>
                        )}
                      </div>
                      {n.message && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t bg-muted/20 text-center">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => {
              setOpen(false)
              router.push("/notifications")
            }}>
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
