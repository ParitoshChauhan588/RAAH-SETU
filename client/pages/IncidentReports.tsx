import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: "theft" | "harassment" | "accident" | "lost" | "other";
  severity: "low" | "medium" | "high";
  location: string;
  timestamp: number;
  status: "reported" | "investigating" | "resolved";
  attachments?: string[];
}

export default function IncidentReports() {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  const [isReporting, setIsReporting] = useState(false);
  const [formData, setFormData] = useState<Omit<Incident, "id" | "timestamp">>({
    title: "",
    description: "",
    type: "other",
    severity: "medium",
    location: "",
    status: "reported",
  });

  const { toast } = useToast();

  const handleSubmitReport = () => {
    if (!formData.title || !formData.description || !formData.location) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const newIncident: Incident = {
      ...formData,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updated = [newIncident, ...incidents];
    setIncidents(updated);
    localStorage.setItem("incidents", JSON.stringify(updated));
    toast({ title: "Success", description: "Incident report submitted successfully" });

    setFormData({
      title: "",
      description: "",
      type: "other",
      severity: "medium",
      location: "",
      status: "reported",
    });
    setIsReporting(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "from-red-500 to-red-600";
      case "medium":
        return "from-orange-500 to-orange-600";
      case "low":
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "theft":
        return "🚨";
      case "harassment":
        return "⚠️";
      case "accident":
        return "🚑";
      case "lost":
        return "🔍";
      default:
        return "📋";
    }
  };

  const stats = {
    total: incidents.length,
    high: incidents.filter((i) => i.severity === "high").length,
    investigating: incidents.filter((i) => i.status === "investigating").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Incident Reports
            </h2>
          </div>
          <p className="text-muted-foreground text-lg mb-8">
            Report safety incidents and track their status
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-sm font-semibold opacity-90">Total Reports</p>
              <p className="mt-3 text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-sm font-semibold opacity-90">High Severity</p>
              <p className="mt-3 text-3xl font-bold">{stats.high}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-sm font-semibold opacity-90">Investigating</p>
              <p className="mt-3 text-3xl font-bold">{stats.investigating}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-sm font-semibold opacity-90">Resolved</p>
              <p className="mt-3 text-3xl font-bold">{stats.resolved}</p>
            </div>
          </div>

          {/* Report Form */}
          {isReporting && (
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
              <h3 className="text-2xl font-bold mb-6">File New Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Incident Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="md:col-span-2 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Incident["type"] })}
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="other">📋 Other</option>
                  <option value="theft">🚨 Theft</option>
                  <option value="harassment">⚠️ Harassment</option>
                  <option value="accident">🚑 Accident</option>
                  <option value="lost">🔍 Lost Item</option>
                </select>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as "low" | "medium" | "high" })}
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="low">🟡 Low</option>
                  <option value="medium">🟠 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="md:col-span-2 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
                <textarea
                  placeholder="Detailed Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="md:col-span-2 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSubmitReport}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setIsReporting(false)}
                  className="px-8 py-3 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isReporting && (
            <button
              onClick={() => setIsReporting(true)}
              className="mb-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
            >
              + File New Report
            </button>
          )}

          {/* Incidents List */}
          <div className="space-y-4">
            {incidents.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-2xl text-muted-foreground">📭 No incident reports</p>
              </div>
            ) : (
              incidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`bg-gradient-to-br ${getSeverityColor(incident.severity)} p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getTypeIcon(incident.type)}</span>
                        <div>
                          <h4 className="text-xl font-bold">{incident.title}</h4>
                          <p className="text-sm opacity-90">{incident.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm opacity-90">{incident.description}</p>
                      <div className="mt-3 flex gap-4 text-sm">
                        <span>📍 {incident.location}</span>
                        <span>⏱️ {new Date(incident.timestamp).toLocaleString()}</span>
                        <span>
                          📊 {incident.status === "resolved" ? "✅ Resolved" : incident.status === "investigating" ? "🔍 Investigating" : "📤 Reported"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
