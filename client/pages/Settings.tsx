import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

interface TrustedZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface SettingsData {
  autoShare: boolean;
  voiceListener: boolean;
  notificationsEnabled: boolean;
  soundAlerts: boolean;
  sosNotifyGuardians: boolean;
  sosNotifyEmergencyContacts: boolean;
  alertTimeout: number;
  trustedZones: TrustedZone[];
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    autoShare: true,
    voiceListener: true,
    notificationsEnabled: true,
    soundAlerts: true,
    sosNotifyGuardians: true,
    sosNotifyEmergencyContacts: true,
    alertTimeout: 300,
    trustedZones: [],
  });
  const [showAddZone, setShowAddZone] = useState(false);
  const [newZone, setNewZone] = useState({ name: "", latitude: "", longitude: "", radius: "500" });
  const { toast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("settings:v1");
      if (raw) {
        setSettings(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("settings:v1", JSON.stringify(settings));
    toast({
      title: "Success",
      description: "Settings saved successfully.",
    });
  };

  const addTrustedZone = () => {
    if (!newZone.name || !newZone.latitude || !newZone.longitude) {
      toast({
        title: "Error",
        description: "Please fill in all zone fields.",
        variant: "destructive",
      });
      return;
    }

    const zone: TrustedZone = {
      id: Date.now().toString(),
      name: newZone.name,
      latitude: parseFloat(newZone.latitude),
      longitude: parseFloat(newZone.longitude),
      radius: parseFloat(newZone.radius),
    };

    setSettings({
      ...settings,
      trustedZones: [...settings.trustedZones, zone],
    });
    setNewZone({ name: "", latitude: "", longitude: "", radius: "500" });
    setShowAddZone(false);
    toast({
      title: "Success",
      description: "Trusted zone added.",
    });
  };

  const deleteZone = (id: string) => {
    setSettings({
      ...settings,
      trustedZones: settings.trustedZones.filter((z) => z.id !== id),
    });
    toast({
      title: "Success",
      description: "Trusted zone removed.",
    });
  };

  const toggleSetting = (key: keyof SettingsData) => {
    if (typeof settings[key] === "boolean") {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <span className="text-3xl">⚙️</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Settings
              </h2>
            </div>
            <p className="mt-2 text-muted-foreground text-lg">
              Control background services and customize your safety preferences.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Safety & Notifications */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-2xl font-bold text-primary">Safety Settings</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <span className="text-sm font-semibold">Auto share location during SOS</span>
                  <input
                    type="checkbox"
                    checked={settings.autoShare}
                    onChange={() => toggleSetting("autoShare")}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <span className="text-sm font-semibold">Enable voice listener</span>
                  <input
                    type="checkbox"
                    checked={settings.voiceListener}
                    onChange={() => toggleSetting("voiceListener")}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <span className="text-sm font-semibold">Enable notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notificationsEnabled}
                    onChange={() => toggleSetting("notificationsEnabled")}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <span className="text-sm font-semibold">Sound alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.soundAlerts}
                    onChange={() => toggleSetting("soundAlerts")}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                </label>
              </div>

              <hr className="my-6 border-slate-300 dark:border-slate-600" />

              <h4 className="font-bold mb-4 text-lg">🚨 SOS Notifications</h4>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-4 bg-red-50 dark:bg-red-950/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition">
                  <span className="text-sm font-semibold">Notify guardians on SOS</span>
                  <input
                    type="checkbox"
                    checked={settings.sosNotifyGuardians}
                    onChange={() => toggleSetting("sosNotifyGuardians")}
                    className="w-5 h-5 cursor-pointer accent-red-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-4 bg-red-50 dark:bg-red-950/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition">
                  <span className="text-sm font-semibold">Notify emergency contacts on SOS</span>
                  <input
                    type="checkbox"
                    checked={settings.sosNotifyEmergencyContacts}
                    onChange={() => toggleSetting("sosNotifyEmergencyContacts")}
                    className="w-5 h-5 cursor-pointer accent-red-500"
                  />
                </label>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-3">
                    ⏱️ Alert timeout (seconds)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="900"
                    step="60"
                    value={settings.alertTimeout}
                    onChange={(e) =>
                      setSettings({ ...settings, alertTimeout: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none transition"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Time before alert is automatically cancelled
                  </p>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
              >
                💾 Save Settings
              </button>
            </div>

            {/* Trusted Zones */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <h3 className="text-2xl font-bold text-green-600">Trusted Zones</h3>
                </div>
                <button
                  onClick={() => setShowAddZone(!showAddZone)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm hover:shadow-lg transform hover:scale-105 transition font-semibold"
                >
                  + Add Zone
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-5 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                ℹ️ Disable SOS alerts when in trusted locations (home, workplace, etc.)
              </p>

              {showAddZone && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 p-5 rounded-xl mb-5 border-2 border-green-200 dark:border-green-800 space-y-3">
                  <input
                    type="text"
                    placeholder="Zone Name (e.g., Home)"
                    value={newZone.name}
                    onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-700 focus:border-green-500 focus:outline-none transition text-sm font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Latitude"
                      step="0.0001"
                      value={newZone.latitude}
                      onChange={(e) => setNewZone({ ...newZone, latitude: e.target.value })}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-700 focus:border-green-500 focus:outline-none transition text-sm font-medium"
                    />
                    <input
                      type="number"
                      placeholder="Longitude"
                      step="0.0001"
                      value={newZone.longitude}
                      onChange={(e) => setNewZone({ ...newZone, longitude: e.target.value })}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-700 focus:border-green-500 focus:outline-none transition text-sm font-medium"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Radius (meters)"
                    value={newZone.radius}
                    onChange={(e) => setNewZone({ ...newZone, radius: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-700 focus:border-green-500 focus:outline-none transition text-sm font-medium"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addTrustedZone}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm hover:shadow-lg transition font-semibold"
                    >
                      ✓ Add
                    </button>
                    <button
                      onClick={() => setShowAddZone(false)}
                      className="flex-1 px-3 py-2 border-2 border-green-300 dark:border-green-700 rounded-lg text-sm hover:bg-green-50 dark:hover:bg-green-950/50 transition font-semibold"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {settings.trustedZones.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-10 text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    📭 No trusted zones added yet.
                  </p>
                ) : (
                  settings.trustedZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-md transition"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{zone.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)} • {zone.radius}m radius
                        </p>
                      </div>
                      <button
                        onClick={() => deleteZone(zone.id)}
                        className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition transform hover:scale-105 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl">
            <p className="text-sm text-blue-900 dark:text-blue-100 flex items-start gap-2">
              <span className="text-lg mt-0.5">ℹ️</span>
              <span>
                <strong>Note:</strong> These settings are stored locally in this demo. For production, connect to a backend for cross-device sync and real-time safety monitoring.
              </span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
