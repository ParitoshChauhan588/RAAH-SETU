import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  // Mock data based on localStorage
  const getAnalyticsData = () => {
    const activities = localStorage.getItem("activities");
    const healthChecks = localStorage.getItem("healthChecks");
    
    return {
      activities: activities ? JSON.parse(activities) : [],
      healthChecks: healthChecks ? JSON.parse(healthChecks) : [],
    };
  };

  const data = getAnalyticsData();

  const stats = useMemo(() => {
    const activities = data.activities || [];
    const healthChecks = data.healthChecks || [];

    return {
      totalAlerts: activities.filter((a: any) => a.type === "SOS").length,
      totalShares: activities.filter((a: any) => a.type === "location_share").length,
      avgHeartRate: healthChecks.length > 0
        ? Math.round(healthChecks.reduce((sum: number, h: any) => sum + (h.heartRate || 0), 0) / healthChecks.length)
        : 0,
      checkInCount: healthChecks.length,
      safeDays: Math.floor(Math.random() * 28) + 1,
      locations: new Set(activities.map((a: any) => a.location || "Unknown")).size,
    };
  }, [data]);

  const chartData = [
    { label: "Mon", value: 45, color: "from-blue-500 to-blue-600" },
    { label: "Tue", value: 52, color: "from-blue-600 to-blue-700" },
    { label: "Wed", value: 38, color: "from-blue-500 to-blue-600" },
    { label: "Thu", value: 61, color: "from-purple-500 to-purple-600" },
    { label: "Fri", value: 55, color: "from-blue-600 to-blue-700" },
    { label: "Sat", value: 42, color: "from-pink-500 to-pink-600" },
    { label: "Sun", value: 35, color: "from-red-500 to-red-600" },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <span className="text-3xl">📊</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                Safety Analytics
              </h2>
            </div>
            <div className="flex gap-2">
              {(["week", "month", "year"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2 rounded-xl font-semibold transition ${
                    timeRange === range
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:shadow-md"
                  }`}
                >
                  {range === "week" ? "Week" : range === "month" ? "Month" : "Year"}
                </button>
              ))}
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-xs font-semibold opacity-90">SOS Alerts</p>
              <p className="mt-2 text-3xl font-bold">{stats.totalAlerts}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-xs font-semibold opacity-90">Locations Shared</p>
              <p className="mt-2 text-3xl font-bold">{stats.totalShares}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-xs font-semibold opacity-90">Avg Heart Rate</p>
              <p className="mt-2 text-3xl font-bold">{stats.avgHeartRate}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-xs font-semibold opacity-90">Check-ins</p>
              <p className="mt-2 text-3xl font-bold">{stats.checkInCount}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-xs font-semibold opacity-90">Safe Days</p>
              <p className="mt-2 text-3xl font-bold">{stats.safeDays}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-xs font-semibold opacity-90">Locations</p>
              <p className="mt-2 text-3xl font-bold">{stats.locations}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-6">Weekly Activity</h3>
              <div className="flex items-end justify-around h-64 gap-2">
                {chartData.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 bg-gradient-to-t ${item.color} rounded-t-lg transition hover:shadow-lg transform hover:scale-110`}
                      style={{ height: `${(item.value / maxValue) * 200}px` }}
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-6">Safety Score Breakdown</h3>
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative w-48 h-48 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500" style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)" }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500" style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)" }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-500" style={{ clipPath: "polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)" }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500" style={{ clipPath: "polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)" }} />
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900" style={{ width: "60%", height: "60%", margin: "auto" }}>
                    <span className="text-3xl font-bold">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
              <h4 className="text-lg font-bold mb-2">✅ Safety Insights</h4>
              <ul className="space-y-2 text-sm">
                <li>• You've been safe for {stats.safeDays} consecutive days</li>
                <li>• Your safety score is 85% - Keep up the good work!</li>
                <li>• Average response time to alerts: 2.3 seconds</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
              <h4 className="text-lg font-bold mb-2">💡 Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li>• Share your location with more trusted contacts</li>
                <li>• Check in more frequently for better wellness tracking</li>
                <li>• Update your emergency contacts regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
