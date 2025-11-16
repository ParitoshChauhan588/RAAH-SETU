import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

interface HealthCheck {
  id: string;
  timestamp: number;
  heartRate?: number;
  mood: "good" | "stressed" | "anxious" | "unwell";
  notes: string;
  location?: { latitude: number; longitude: number };
}

export default function HealthCheck() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [mood, setMood] = useState<"good" | "stressed" | "anxious" | "unwell">("good");
  const [heartRate, setHeartRate] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("healthchecks:v1");
      if (raw) {
        setHealthChecks(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load health checks", e);
    }
  }, []);

  const submitCheck = async () => {
    let location = undefined;
    
    try {
      if (navigator.geolocation) {
        location = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            },
            () => resolve(undefined)
          );
        });
      }
    } catch (e) {
      console.error("Failed to get location", e);
    }

    const check: HealthCheck = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mood,
      notes,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      location,
    };

    const updated = [check, ...healthChecks];
    setHealthChecks(updated);
    localStorage.setItem("healthchecks:v1", JSON.stringify(updated));

    toast({
      title: "Health Check Recorded",
      description: `Your wellness status has been recorded.`,
    });

    setMood("good");
    setHeartRate("");
    setNotes("");
  };

  const getMoodEmoji = (m: string) => {
    switch (m) {
      case "good":
        return "😊";
      case "stressed":
        return "😤";
      case "anxious":
        return "😰";
      case "unwell":
        return "🤒";
      default:
        return "😐";
    }
  };

  const getMoodColor = (m: string) => {
    switch (m) {
      case "good":
        return "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100";
      case "stressed":
        return "bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-100";
      case "anxious":
        return "bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100";
      case "unwell":
        return "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100";
      default:
        return "";
    }
  };

  const avgHeartRate = healthChecks
    .filter((h) => h.heartRate)
    .reduce((sum, h) => sum + (h.heartRate || 0), 0) / healthChecks.filter((h) => h.heartRate).length || 0;

  const moodCounts = {
    good: healthChecks.filter((h) => h.mood === "good").length,
    stressed: healthChecks.filter((h) => h.mood === "stressed").length,
    anxious: healthChecks.filter((h) => h.mood === "anxious").length,
    unwell: healthChecks.filter((h) => h.mood === "unwell").length,
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <span className="text-3xl">💚</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                Health & Wellness
              </h2>
            </div>
            <p className="mt-2 text-muted-foreground text-lg">
              Track your wellness and mood throughout the day to improve your mental health.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Check Form */}
            <div className="lg:col-span-1 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-fit hover:shadow-xl transition">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">📝</span>
                <h3 className="text-2xl font-bold text-primary">Quick Check-in</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-3">
                    How are you feeling?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["good", "stressed", "anxious", "unwell"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`p-4 rounded-xl border-2 transition transform hover:scale-110 ${
                          mood === m
                            ? "border-primary bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg"
                            : "border-slate-300 dark:border-slate-600 hover:border-primary/50"
                        }`}
                      >
                        <div className="text-3xl">{getMoodEmoji(m)}</div>
                        <div className="text-xs mt-2 capitalize font-semibold">{m}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    💓 Heart Rate (optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="40"
                      max="200"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="BPM"
                      className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none transition font-semibold"
                    />
                    <span className="text-xs font-bold text-muted-foreground">bpm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    📝 Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How you're feeling, symptoms, etc."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none transition h-24 resize-none font-medium"
                  />
                </div>

                <button
                  onClick={submitCheck}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition"
                >
                  ✓ Record Check-in
                </button>
              </div>
            </div>

            {/* Stats and History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                  <p className="text-sm font-semibold opacity-90">Total Check-ins</p>
                  <p className="mt-3 text-3xl font-bold">{healthChecks.length}</p>
                </div>
                {avgHeartRate > 0 && (
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                    <p className="text-sm font-semibold opacity-90">Avg Heart Rate</p>
                    <p className="mt-3 text-3xl font-bold">{Math.round(avgHeartRate)}</p>
                    <p className="text-xs opacity-90 mt-1">bpm</p>
                  </div>
                )}
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                  <p className="text-sm font-semibold opacity-90">Feeling Good</p>
                  <p className="mt-3 text-3xl font-bold">{moodCounts.good}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
                  <p className="text-sm font-semibold opacity-90">Need Support</p>
                  <p className="mt-3 text-3xl font-bold">
                    {moodCounts.stressed + moodCounts.anxious + moodCounts.unwell}
                  </p>
                </div>
              </div>

              {/* Recent Check-ins */}
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-xl font-bold">Recent Check-ins</h3>
                </div>
                <div className="space-y-3">
                  {healthChecks.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-10 text-center">
                      📭 No check-ins yet. Start tracking your wellness!
                    </p>
                  ) : (
                    healthChecks.slice(0, 10).map((check) => (
                      <div
                        key={check.id}
                        className={`p-4 rounded-xl border-2 transform hover:scale-105 transition ${getMoodColor(check.mood)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{getMoodEmoji(check.mood)}</span>
                            <div>
                              <p className="font-bold capitalize">{check.mood}</p>
                              <p className="text-xs opacity-75">
                                {new Date(check.timestamp).toLocaleString()}
                              </p>
                              {check.notes && <p className="text-sm mt-1 opacity-90">{check.notes}</p>}
                              {check.heartRate && (
                                <p className="text-xs mt-1 font-semibold">Heart Rate: {check.heartRate} bpm</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Wellness Tips</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Regular check-ins help track patterns in your emotional wellness</li>
              <li>If you're consistently stressed or anxious, consider reaching out to a counselor</li>
              <li>Normal resting heart rate is 60-100 bpm for adults</li>
              <li>Share your wellness data with trusted guardians for their peace of mind</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
