import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SOSButton from "@/components/SOSButton";
import { useToast } from "@/components/ui/use-toast";
import { useAlert } from "@/state/AlertContext";
import { AlertCircle, CheckCircle2, Mail, MessageSquare, MapPin, Clock } from "lucide-react";

export default function SOS() {
  const [shareLocation, setShareLocation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosHistory, setSosHistory] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const { toast } = useToast();
  const alert = useAlert();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("sos_history") || "[]");
    setSosHistory(history);

    if (shareLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Location access denied")
      );
    }
  }, [shareLocation]);

  const getEmergencyContacts = () => {
    try {
      return JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
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
    try {
      const contacts = getEmergencyContacts();
      const userData = getUserData();

      if (contacts.length === 0) {
        toast({
          title: "No Contacts",
          description: "Please add emergency contacts before activating SOS",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      let currentLocation = "Location disabled";
      if (shareLocation && navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition((position) => {
            currentLocation = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            resolve(null);
          });
        });
      }

      const response = await fetch("http://127.0.0.1:5000/api/sos/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: currentLocation,
          emergencyContacts: contacts,
          userData
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSosActive(true);

        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          location: currentLocation,
          contacts_notified: data.alert.contacts_notified,
          status: "active",
          notifications: data.notifications
        };
        const updatedHistory = [newEntry, ...sosHistory];
        localStorage.setItem("sos_history", JSON.stringify(updatedHistory));
        setSosHistory(updatedHistory);

        toast({
          title: "🚨 SOS ACTIVATED",
          description: `Emergency notifications sent to ${contacts.length} contacts via email and SMS!`
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to activate SOS",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("SOS error:", error);
      toast({
        title: "Error",
        description: "Failed to activate SOS. Check backend connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSOS = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/sos/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (response.ok) {
        setSosActive(false);
        toast({
          title: "SOS Resolved",
          description: "Emergency alert has been deactivated"
        });
      }
    } catch (error) {
      console.error("Deactivate error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main SOS Section */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-8 shadow-xl border-2 transition-all ${
                sosActive 
                  ? 'bg-red-50 dark:bg-red-950 border-red-500' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-full ${sosActive ? 'bg-red-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <AlertCircle size={40} className={sosActive ? 'text-red-600' : 'text-slate-600'} />
                  </div>
                  <div>
                    <h1 className={`text-4xl font-bold ${sosActive ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                      {sosActive ? '🚨 EMERGENCY ACTIVE' : 'Emergency / SOS'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      {sosActive 
                        ? 'Emergency alert is active. Emergency contacts have been notified via email and SMS.'
                        : 'Activate emergency SOS to notify all emergency contacts immediately via email and SMS.'}
                    </p>
                  </div>
                </div>

                {/* Location Info */}
                {location && sosActive && (
                  <div className="mt-6 bg-white dark:bg-slate-700 rounded-lg p-4 flex items-center gap-3">
                    <MapPin className="text-blue-600" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Current Location</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="mt-8 flex gap-4">
                  {!sosActive ? (
                    <button
                      onClick={handleActivateSOS}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {loading ? "Activating..." : "🚨 ACTIVATE SOS"}
                    </button>
                  ) : (
                    <button
                      onClick={handleResolveSOS}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {loading ? "Resolving..." : "✓ RESOLVE EMERGENCY"}
                    </button>
                  )}
                </div>

                {/* Location Sharing */}
                <div className="mt-6">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareLocation}
                      onChange={(e) => setShareLocation(e.target.checked)}
                      className="w-5 h-5 accent-red-600"
                      disabled={sosActive}
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Share live location with responders
                    </span>
                  </label>
                </div>

                {/* Service Status */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                    <Mail size={24} className="mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-semibold">Email Alerts</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Enabled</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                    <MessageSquare size={24} className="mx-auto text-green-600 mb-2" />
                    <p className="text-sm font-semibold">SMS Alerts</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Enabled</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                    <MapPin size={24} className="mx-auto text-purple-600 mb-2" />
                    <p className="text-sm font-semibold">GPS Tracking</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{shareLocation ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert History */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Recent Alerts
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sosHistory.length > 0 ? (
                    sosHistory.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                        alert.status === 'active' 
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                          : 'bg-slate-50 dark:bg-slate-700 border-green-500'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              {alert.status === 'active' ? '🚨' : '✓'} {alert.status.toUpperCase()}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.timestamp}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              📍 {alert.location}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              👥 {alert.contacts_notified?.length || 0} notified
                            </p>
                          </div>
                        </div>
                        {alert.notifications && alert.notifications.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 text-xs">
                            {alert.notifications.map((notif: any, i: number) => (
                              <p key={i} className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                {notif.method === 'email' ? '📧' : '📱'} {notif.contact} ({notif.method})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">
                      No SOS alerts yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts Warning */}
          {getEmergencyContacts().length === 0 && (
            <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-600" size={20} />
                <div>
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">No Emergency Contacts Added</p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                    Please add emergency contacts before activating SOS. Go to <a href="/emergency-contacts" className="underline font-bold">Emergency Contacts</a> to add them.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
