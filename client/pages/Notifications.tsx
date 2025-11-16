import React, { useState } from "react";
import Layout from "@/components/Layout";

interface Notification {
  id: string;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: { label: string; url: string };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [
      { id: "1", type: "success", title: "Welcome to RAAH-SETU", message: "Your account has been created successfully", timestamp: Date.now() - 3600000, read: false },
      { id: "2", type: "info", title: "Location Shared", message: "Your location was shared with 2 guardians", timestamp: Date.now() - 7200000, read: true },
      { id: "3", type: "alert", title: "Emergency Alert", message: "SOS activated - Emergency services notified", timestamp: Date.now() - 10800000, read: false },
    ];
  });

  const [filter, setFilter] = useState<"all" | "unread" | "alerts">("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "alerts") return n.type === "alert" || n.type === "warning";
    return true;
  });

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "alert":
        return "from-red-500 to-red-600";
      case "warning":
        return "from-orange-500 to-orange-600";
      case "success":
        return "from-green-500 to-green-600";
      case "info":
        return "from-blue-500 to-blue-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return "🚨";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      default:
        return "📬";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <span className="text-3xl">🔔</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            {(["all", "unread", "alerts"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl font-semibold transition ${
                  filter === f
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:shadow-md border border-slate-200 dark:border-slate-700"
                }`}
              >
                {f === "all" ? "All" : f === "unread" ? "Unread" : "Alerts"}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-2xl text-muted-foreground">
                  {filter === "unread" ? "📭 No unread notifications" : filter === "alerts" ? "✅ No alerts" : "📭 No notifications"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`bg-gradient-to-br ${getNotificationColor(notification.type)} p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-102 transition ${
                    !notification.read ? "border-4 border-white dark:border-slate-700" : "opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between text-white">
                    <div className="flex-1 flex gap-4">
                      <span className="text-4xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">{notification.title}</h3>
                          {!notification.read && (
                            <span className="px-3 py-1 bg-white/30 rounded-full text-xs font-bold">NEW</span>
                          )}
                        </div>
                        <p className="text-sm opacity-90 mt-2">{notification.message}</p>
                        <p className="text-xs opacity-75 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                        {notification.action && (
                          <a
                            href={notification.action.url}
                            className="mt-3 inline-block px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition"
                          >
                            {notification.action.label}
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-white/60 hover:text-white text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notification Settings */}
          <div className="mt-12 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold mb-6">Notification Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                <span className="font-semibold">🚨 Emergency Alerts</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                <span className="font-semibold">📱 Location Updates</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                <span className="font-semibold">👥 Guardian Requests</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="font-semibold">💡 Tips & Resources</span>
              </label>
            </div>
            <button className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
