import React, { useMemo } from "react";
import Layout from "@/components/Layout";
import MapView from "@/components/MapView";
import SOSButton from "@/components/SOSButton";
import { useAlert } from "@/state/AlertContext";
import ShareLocationButton from "@/components/ShareLocationButton";

function Timer({ startedAt }: { startedAt: number | null }) {
  const now = Date.now();
  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  return (
    <div className="text-2xl font-semibold text-rose-600">
      {mm}:{ss.toString().padStart(2, "0")}
    </div>
  );
}

export default function Dashboard() {
  const alert = useAlert();

  const nearbyCount = useMemo(() => alert.nearby.length, [alert.nearby]);

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <span className="text-3xl">🏠</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Welcome back
                </h2>
              </div>
              <p className="mt-2 text-muted-foreground text-lg">
                Your safety dashboard is ready. Stay connected and stay safe.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <SOSButton />
              <a
                href="/sos"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold hover:shadow-lg transform hover:scale-105 transition"
              >
                Open SOS
              </a>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold opacity-90">Location Status</div>
                  <div className="mt-2 text-3xl font-bold">
                    {alert.isTracking ? "🟢 Active" : "🔴 Inactive"}
                  </div>
                </div>
                <span className="text-4xl">📍</span>
              </div>
              <div className="mt-3">
                <div className="text-xs opacity-80">
                  Location tracking is {alert.isTracking ? "enabled" : "disabled"}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold opacity-90">Nearby Users</div>
                  <div className="mt-2 text-3xl font-bold">{nearbyCount}</div>
                </div>
                <span className="text-4xl">👥</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold opacity-90">Safety Score</div>
                  <div className="mt-2 text-3xl font-bold">{alert.safetyScore}%</div>
                </div>
                <span className="text-4xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🗺️</span>
                <h4 className="font-bold text-lg">Live Location</h4>
              </div>
              <MapView className="w-full h-64 rounded-xl" />
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <h4 className="font-bold text-lg">Quick Actions</h4>
              </div>
              <ShareLocationButton />
            </div>
          </div>

          {alert.active && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[hsl(var(--destructive))] font-semibold">
                      Emergency Alert Active
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Alert sent at{" "}
                      {new Date(alert.startedAt!).toLocaleTimeString()}
                    </div>
                  </div>

                  <div>
                    <Timer startedAt={alert.startedAt} />
                    <div className="mt-2">
                      <button
                        onClick={alert.resolveSOS}
                        className="px-3 py-2 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-md"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    This will notify your guardians and nearby users. Stay safe
                    and wait for responders.
                  </p>
                </div>
              </div>

              <div className="bg-[hsl(var(--card))] rounded-lg shadow p-4 border border-[hsl(var(--border))]">
                <h4 className="font-semibold text-primary">Nearby Users</h4>
                <div className="mt-3 space-y-2">
                  {alert.nearby.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {u.distanceKm} km away
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded text-xs ${
                            u.status === "responding"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {u.status === "responding"
                            ? "Responding"
                            : "Notified"}
                        </div>
                        <button
                          onClick={() => alert.notifyUser(u.id)}
                          className="text-sm text-muted-foreground"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <a href="/emergency-contacts" className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transform hover:scale-105 transition">
              <p className="text-sm font-semibold opacity-90">Emergency Contacts</p>
              <p className="mt-3 text-3xl font-bold">
                {JSON.parse(localStorage.getItem("emergencyContacts") || "[]").length}
              </p>
            </a>
            <a href="/incidents" className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transform hover:scale-105 transition">
              <p className="text-sm font-semibold opacity-90">Reported Incidents</p>
              <p className="mt-3 text-3xl font-bold">
                {JSON.parse(localStorage.getItem("incidents") || "[]").length}
              </p>
            </a>
            <a href="/activity" className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transform hover:scale-105 transition">
              <p className="text-sm font-semibold opacity-90">Activities Logged</p>
              <p className="mt-3 text-3xl font-bold">
                {JSON.parse(localStorage.getItem("activities") || "[]").length}
              </p>
            </a>
            <a href="/health" className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transform hover:scale-105 transition">
              <p className="text-sm font-semibold opacity-90">Health Check-ins</p>
              <p className="mt-3 text-3xl font-bold">
                {JSON.parse(localStorage.getItem("healthChecks") || "[]").length}
              </p>
            </a>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-primary">
              Recent Activity
            </h3>
            <div className="mt-4 space-y-3">
              {JSON.parse(localStorage.getItem("reports:v1") || "[]")
                .slice(0, 3)
                .map((r: any) => (
                  <div
                    key={r.id}
                    className="p-3 bg-[hsl(var(--card))] rounded-md border border-[hsl(var(--border))]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.time}
                        </div>
                      </div>
                      <div className="text-sm text-emerald-600">Resolved</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
