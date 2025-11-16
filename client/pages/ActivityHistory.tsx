import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

interface Activity {
  id: string;
  type: "sos" | "location_share" | "guardian_added" | "alert_received" | "zone_entered" | "zone_exited";
  title: string;
  description: string;
  timestamp: number;
  details?: Record<string, any>;
}

export default function ActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<Activity["type"] | "all">("all");
  const { toast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("activities:v1");
      if (raw) {
        setActivities(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load activities", e);
    }
  }, []);

  const addActivity = (activity: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      ...activity,
    };
    const updated = [newActivity, ...activities];
    setActivities(updated);
    localStorage.setItem("activities:v1", JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all activity history?")) {
      setActivities([]);
      localStorage.removeItem("activities:v1");
      toast({
        title: "Success",
        description: "Activity history cleared.",
      });
    }
  };

  const exportHistory = () => {
    const data = JSON.stringify(activities, null, 2);
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
    element.setAttribute("download", `activity-history-${Date.now()}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Success",
      description: "Activity history exported.",
    });
  };

  const filteredActivities =
    filter === "all" ? activities : activities.filter((a) => a.type === filter);

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "sos":
        return "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100";
      case "location_share":
        return "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100";
      case "guardian_added":
        return "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100";
      case "alert_received":
        return "bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100";
      case "zone_entered":
        return "bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100";
      case "zone_exited":
        return "bg-indigo-100 dark:bg-indigo-950 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100";
      default:
        return "bg-gray-100 dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100";
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "sos":
        return "🚨";
      case "location_share":
        return "📍";
      case "guardian_added":
        return "👥";
      case "alert_received":
        return "🔔";
      case "zone_entered":
        return "✅";
      case "zone_exited":
        return "⚠️";
      default:
        return "•";
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <span className="text-3xl">📋</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Activity History
                </h2>
              </div>
              <p className="mt-2 text-muted-foreground text-lg">
                Track all your safety-related activities and events.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportHistory}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
              >
                📥 Export
              </button>
              <button
                onClick={clearHistory}
                className="px-6 py-3 border-2 border-red-300 dark:border-red-700 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold transition"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition transform ${
                filter === "all"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600"
              }`}
            >
              📊 All Activities
            </button>
            <button
              onClick={() => setFilter("sos")}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition transform ${
                filter === "sos"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600"
              }`}
            >
              🚨 SOS Events
            </button>
            <button
              onClick={() => setFilter("location_share")}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition transform ${
                filter === "location_share"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600"
              }`}
            >
              📍 Location Shares
            </button>
            <button
              onClick={() => setFilter("alert_received")}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition transform ${
                filter === "alert_received"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600"
              }`}
            >
              🔔 Alerts Received
            </button>
          </div>

          {/* Activities List */}
          <div className="mt-8 space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="p-12 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                <p className="text-lg text-muted-foreground">📭 No activities to display.</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-5 rounded-2xl border-2 transform hover:scale-105 transition shadow-md hover:shadow-lg ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg">{activity.title}</h4>
                        <span className="text-xs font-semibold opacity-75">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mb-2">{activity.description}</p>
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <details className="mt-3 text-xs opacity-75">
                          <summary className="cursor-pointer font-semibold hover:opacity-100 transition">
                            📄 View Details
                          </summary>
                          <pre className="bg-black bg-opacity-10 p-3 rounded-lg mt-2 overflow-x-auto text-xs">
                            {JSON.stringify(activity.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats */}
          {activities.length > 0 && (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                <p className="text-sm font-semibold opacity-90">Total Events</p>
                <p className="mt-3 text-3xl font-bold">{activities.length}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                <p className="text-sm font-semibold opacity-90">SOS Events</p>
                <p className="mt-3 text-3xl font-bold">
                  {activities.filter((a) => a.type === "sos").length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                <p className="text-sm font-semibold opacity-90">Location Shares</p>
                <p className="mt-3 text-3xl font-bold">
                  {activities.filter((a) => a.type === "location_share").length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                <p className="text-sm font-semibold opacity-90">Last Activity</p>
                <p className="mt-3 text-sm font-bold">
                  {new Date(activities[0].timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
