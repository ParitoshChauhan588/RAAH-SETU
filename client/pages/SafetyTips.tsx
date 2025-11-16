import React, { useState } from "react";
import Layout from "@/components/Layout";

interface SafetyTip {
  id: string;
  title: string;
  description: string;
  category: "prevention" | "response" | "awareness";
  icon: string;
}

export default function SafetyTips() {
  const [activeCategory, setActiveCategory] = useState<"prevention" | "response" | "awareness">("prevention");

  const tips: SafetyTip[] = [
    {
      id: "1",
      title: "Always Share Your Location",
      description: "Keep trusted contacts informed about your whereabouts, especially when traveling alone.",
      category: "prevention",
      icon: "📍",
    },
    {
      id: "2",
      title: "Trust Your Instincts",
      description: "If something feels wrong, it probably is. Remove yourself from uncomfortable situations immediately.",
      category: "prevention",
      icon: "🧠",
    },
    {
      id: "3",
      title: "Maintain Regular Check-ins",
      description: "Let someone know when you arrive at your destination safely.",
      category: "prevention",
      icon: "✅",
    },
    {
      id: "4",
      title: "Keep Phone Charged",
      description: "Always ensure your phone has enough battery to make emergency calls.",
      category: "prevention",
      icon: "🔋",
    },
    {
      id: "5",
      title: "In Case of Emergency",
      description: "Call emergency services immediately (911 in US, 999 in UK, 112 in EU). Stay calm and provide clear information.",
      category: "response",
      icon: "🚨",
    },
    {
      id: "6",
      title: "Document Everything",
      description: "If you experience harassment or danger, document dates, times, and details for authorities.",
      category: "response",
      icon: "📝",
    },
    {
      id: "7",
      title: "Use Safe Routes",
      description: "Plan routes in advance and choose well-lit, populated areas when possible.",
      category: "response",
      icon: "🗺️",
    },
    {
      id: "8",
      title: "Situational Awareness",
      description: "Stay aware of your surroundings. Notice people and vehicles around you.",
      category: "awareness",
      icon: "👀",
    },
    {
      id: "9",
      title: "Secure Your Accounts",
      description: "Use strong passwords and enable two-factor authentication on important accounts.",
      category: "awareness",
      icon: "🔐",
    },
  ];

  const filteredTips = tips.filter((tip) => tip.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "prevention":
        return "from-blue-500 to-blue-600";
      case "response":
        return "from-red-500 to-red-600";
      case "awareness":
        return "from-green-500 to-green-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <span className="text-3xl">💡</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Safety Tips & Resources
            </h2>
          </div>
          <p className="text-muted-foreground text-lg mb-8">
            Learn essential safety practices to protect yourself and others
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {(["prevention", "response", "awareness"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                  activeCategory === category
                    ? `bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg`
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:shadow-md border border-slate-200 dark:border-slate-700"
                }`}
              >
                {category === "prevention"
                  ? "🛡️ Prevention"
                  : category === "response"
                  ? "🚨 Response"
                  : "👀 Awareness"}
              </button>
            ))}
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className={`bg-gradient-to-br ${getCategoryColor(tip.category)} p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transform hover:scale-105 transition`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tip.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>

          {/* Emergency Contacts Section */}
          <div className="mt-12 bg-gradient-to-br from-red-500 to-red-600 p-8 rounded-2xl shadow-lg text-white">
            <h3 className="text-2xl font-bold mb-6">🚨 Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="font-semibold mb-2">Emergency Services (US)</p>
                <p className="text-2xl font-bold">911</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="font-semibold mb-2">International Emergency</p>
                <p className="text-2xl font-bold">112</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="font-semibold mb-2">Police (Non-Emergency)</p>
                <p className="text-2xl font-bold">311</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="font-semibold mb-2">Crisis Hotline</p>
                <p className="text-2xl font-bold">988</p>
              </div>
            </div>
          </div>

          {/* Quick Checklist */}
          <div className="mt-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold mb-6">✅ Safety Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                <span className="font-semibold">📱 Phone fully charged</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="font-semibold">🔋 Emergency charger packed</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="font-semibold">📍 Location shared</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="font-semibold">👥 Contacts notified</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="font-semibold">🗺️ Route planned</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="font-semibold">⏰ Expected arrival time set</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
