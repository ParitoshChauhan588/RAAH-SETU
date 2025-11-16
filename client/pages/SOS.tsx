import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { AlertCircle, CheckCircle2, Mail, MessageSquare, MapPin, Clock, Phone, Zap, Heart, Shield, Send } from "lucide-react";

export default function SOS() {
  const [loading, setLoading] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosHistory, setSosHistory] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [notificationStatus, setNotificationStatus] = useState("");
  const [guardians, setGuardians] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [notifiedList, setNotifiedList] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("sos_history") || "[]");
    setSosHistory(history);

    // Load guardians
    try {
      const guardianData = JSON.parse(localStorage.getItem("guardians:v1") || "[]");
      setGuardians(guardianData);
    } catch {
      setGuardians([]);
    }

    // Load emergency contacts
    try {
      const contactData = JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
      setContacts(contactData);
    } catch {
      setContacts([]);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Location access denied")
      );
    }
  }, []);

  const getEmergencyContacts = () => {
    try {
      return JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
    } catch {
      return [];
    }
  };

  const getGuardians = () => {
    try {
      return JSON.parse(localStorage.getItem("guardians:v1") || "[]");
    } catch {
      return [];
    }
  };

  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const handleActivateSOS = async () => {
    setLoading(true);
    setNotificationStatus("🚨 Sending SOS to all contacts...");
    setNotifiedList([]);
    
    try {
      const allContacts = [
        ...getGuardians().map(g => ({ ...g, type: 'guardian' })),
        ...getEmergencyContacts().map(c => ({ ...c, type: 'contact' }))
      ];

      if (allContacts.length === 0) {
        setNotificationStatus("❌ No guardians or emergency contacts added");
        setLoading(false);
        return;
      }

      let currentLocation = "Location disabled";
      if (location) {
        currentLocation = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      }

      const response = await fetch("http://127.0.0.1:5000/api/sos/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: currentLocation,
          emergencyContacts: allContacts,
          userData: getUserData()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSosActive(true);
        setNotifiedList(allContacts);
        
        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          location: currentLocation,
          contacts_notified: allContacts.length,
          status: "active",
          contacts: allContacts
        };
        const updatedHistory = [newEntry, ...sosHistory];
        localStorage.setItem("sos_history", JSON.stringify(updatedHistory));
        setSosHistory(updatedHistory);

        setNotificationStatus(`✅ SOS sent to ${allContacts.length} guardians & contacts!`);
      } else {
        setNotificationStatus(`❌ ${data.error || "Failed to send SOS"}`);
      }
    } catch (error) {
      console.error("SOS error:", error);
      setNotificationStatus("❌ Connection error - Backend may be down");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSOS = () => {
    setSosActive(false);
    setNotificationStatus("✅ SOS Alert Resolved - All contacts notified");
    setTimeout(() => setNotificationStatus(""), 3000);
  };

  const totalContacts = (getGuardians().length || 0) + (getEmergencyContacts().length || 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-red-950 dark:to-slate-900 py-12">
        <div className="container mx-auto px-4 lg:px-20">
          {/* Main SOS Button Section */}
          <div className="mb-12">
            <div className={`rounded-3xl p-8 lg:p-12 transition-all duration-500 ${
              sosActive 
                ? 'bg-gradient-to-br from-red-600 to-red-800 shadow-2xl ring-4 ring-red-300 dark:ring-red-800' 
                : 'bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 shadow-xl border-2 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex flex-col items-center text-center gap-8">
                {/* Status Indicator */}
                <div className="relative">
                  <div className={`p-6 rounded-full transition-all ${
                    sosActive 
                      ? 'bg-red-500/30 animate-pulse' 
                      : 'bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30'
                  }`}>
                    <Zap size={64} className={sosActive ? 'text-white animate-bounce' : 'text-red-600 dark:text-red-400'} />
                  </div>
                  {sosActive && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-red-500/20"></div>
                  )}
                </div>

                {/* Title & Status */}
                <div>
                  <h1 className={`text-5xl lg:text-6xl font-black tracking-tight ${
                    sosActive 
                      ? 'text-white' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400'
                  }`}>
                    {sosActive ? '🚨 EMERGENCY ACTIVE' : 'ONE TAP SOS'}
                  </h1>
                  <p className={`text-lg mt-3 ${
                    sosActive 
                      ? 'text-red-100' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {sosActive 
                      ? `🔔 All ${totalContacts} guardians & contacts have been notified` 
                      : `Instantly alert ${totalContacts} guardians & emergency contacts`}
                  </p>
                </div>

                {/* Location Display */}
                {location && sosActive && (
                  <div className="bg-white/20 dark:bg-slate-900/30 backdrop-blur rounded-2xl p-4 w-full max-w-md text-left">
                    <div className="flex items-center gap-3 text-white">
                      <MapPin size={24} />
                      <div>
                        <p className="text-sm font-semibold opacity-90">Your Location</p>
                        <p className="text-lg font-bold">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Status Message */}
                {notificationStatus && (
                  <div className={`rounded-2xl p-4 w-full max-w-md border-2 ${
                    notificationStatus.includes('✅') 
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600' 
                      : 'bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600'
                  }`}>
                    <p className={`font-semibold text-center ${
                      notificationStatus.includes('✅') 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {notificationStatus}
                    </p>
                  </div>
                )}

                {/* Main Action Button */}
                <div className="w-full max-w-md">
                  {!sosActive ? (
                    <button
                      onClick={handleActivateSOS}
                      disabled={loading || totalContacts === 0}
                      className={`w-full py-6 px-8 rounded-2xl text-2xl font-black transition-all duration-300 shadow-2xl hover:shadow-3xl active:scale-95 ${
                        totalContacts === 0
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:scale-105 active:scale-95'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Zap className="animate-spin" size={28} />
                          ACTIVATING SOS...
                        </span>
                      ) : (
                        '🚨 ACTIVATE SOS NOW'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleResolveSOS}
                      disabled={loading}
                      className="w-full py-6 px-8 rounded-2xl text-2xl font-black bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95"
                    >
                      {loading ? '✓ RESOLVING...' : '✓ RESOLVE EMERGENCY'}
                    </button>
                  )}
                </div>

                {/* Help Text */}
                {!sosActive && totalContacts > 0 && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 justify-center">
                    <Shield size={16} />
                    One tap will send alerts to all your guardians and emergency contacts via Email & SMS
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contacts & Guardians Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Guardians Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Heart size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Guardians</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Trusted people monitoring your safety</p>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {getGuardians().length > 0 ? (
                  getGuardians().map((g: any) => (
                    <div key={g.id} className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <p className="font-semibold text-slate-900 dark:text-white">{g.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{g.phone}</p>
                      {g.primary && <span className="inline-block mt-2 px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-xs font-bold rounded">PRIMARY</span>}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">No guardians yet</p>
                )}
              </div>
              <a href="/guardians" className="mt-4 block w-full py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-center font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all">
                + Add Guardian
              </a>
            </div>

            {/* Emergency Contacts Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Phone size={24} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Emergency Contacts</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Additional people to notify</p>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {getEmergencyContacts().length > 0 ? (
                  getEmergencyContacts().map((c: any) => (
                    <div key={c.id} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                      <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{c.phone}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">No contacts yet</p>
                )}
              </div>
              <a href="/emergency-contacts" className="mt-4 block w-full py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-center font-semibold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all">
                + Add Contact
              </a>
            </div>

            {/* Active Alert Details */}
            {sosActive && notifiedList.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border-2 border-green-300 dark:border-green-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-200 dark:bg-green-900/40 rounded-lg">
                    <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Alerts Sent</h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">All recipients notified</p>
                <div className="space-y-2">
                  {notifiedList.map((person: any) => (
                    <div key={person.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700/50 rounded-lg">
                      <Send size={16} className="text-green-600 dark:text-green-400" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{person.name}</p>
                      <span className="ml-auto text-xs text-green-600 dark:text-green-400">✓ Sent</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Alert History */}
          {sosHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock size={28} className="text-indigo-600 dark:text-indigo-400" />
                Alert History
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sosHistory.slice(0, 6).map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
                    alert.status === 'active' 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                      : 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  }`}>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">
                      {alert.status === 'active' ? '🚨' : '✅'} {alert.status.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{alert.timestamp}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">📍 {alert.location}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">👥 {alert.contacts_notified} notified</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Setup Warning */}
          {totalContacts === 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl p-8 text-center">
              <AlertCircle className="mx-auto text-yellow-600 dark:text-yellow-500 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Setup Required</h3>
              <p className="text-yellow-900 dark:text-yellow-200 mb-6 max-w-md mx-auto">
                Add guardians and emergency contacts to use SOS. This ensures people know your location and status in emergencies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/guardians" className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all">
                  Add Guardians
                </a>
                <a href="/emergency-contacts" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all">
                  Add Contacts
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
