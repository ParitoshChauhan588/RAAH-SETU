import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

interface ProfileData {
  name: string;
  phone: string;
  email?: string;
  medicalInfo?: string;
  emergencyContacts: EmergencyContact[];
}

export default function Profile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  const { toast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("profile:v1");
      if (raw) {
        const p: ProfileData = JSON.parse(raw);
        setName(p.name || "");
        setPhone(p.phone || "");
        setEmail(p.email || "");
        setMedicalInfo(p.medicalInfo || "");
        setEmergencyContacts(p.emergencyContacts || []);
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  }, []);

  const save = () => {
    const profileData: ProfileData = {
      name,
      phone,
      email,
      medicalInfo,
      emergencyContacts,
    };
    localStorage.setItem("profile:v1", JSON.stringify(profileData));
    toast({
      title: "Success",
      description: "Profile saved successfully.",
    });
  };

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Error",
        description: "Please fill in all contact fields.",
        variant: "destructive",
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact,
    };

    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ name: "", phone: "", relation: "" });
    setShowAddContact(false);
    toast({
      title: "Success",
      description: "Emergency contact added.",
    });
  };

  const deleteContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
    toast({
      title: "Success",
      description: "Emergency contact removed.",
    });
  };

  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setMedicalInfo("");
    setEmergencyContacts([]);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Profile
              </h2>
            </div>
            <p className="mt-2 text-muted-foreground">
              Manage your account and emergency contact preferences with ease.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">ℹ️</span>
                <h3 className="text-2xl font-bold text-primary">Personal Information</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none transition font-medium"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none transition font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none transition font-medium"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    Medical Information
                  </label>
                  <textarea
                    value={medicalInfo}
                    onChange={(e) => setMedicalInfo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none transition h-24 resize-none font-medium"
                    placeholder="Allergies, blood type, medications, etc."
                  />
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={save}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-xl hover:shadow-lg transform hover:scale-105 transition font-semibold"
                  >
                    💾 Save Profile
                  </button>
                  <button
                    onClick={reset}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  <h3 className="text-2xl font-bold text-red-600">Emergency Contacts</h3>
                </div>
                <button
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm hover:shadow-lg transform hover:scale-105 transition font-semibold"
                >
                  + Add Contact
                </button>
              </div>

              {showAddContact && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 p-5 rounded-xl mb-5 border border-red-200 dark:border-red-800 space-y-3">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-700 focus:border-red-500 focus:outline-none transition text-sm font-medium"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-700 focus:border-red-500 focus:outline-none transition text-sm font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g., Mother, Friend)"
                    value={newContact.relation}
                    onChange={(e) =>
                      setNewContact({ ...newContact, relation: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-700 focus:border-red-500 focus:outline-none transition text-sm font-medium"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addEmergencyContact}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm hover:shadow-lg transition font-semibold"
                    >
                      ✓ Add
                    </button>
                    <button
                      onClick={() => setShowAddContact(false)}
                      className="flex-1 px-3 py-2 border-2 border-red-300 dark:border-red-700 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-950/50 transition font-semibold"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {emergencyContacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">
                    📭 No emergency contacts added yet. Add one to stay protected!
                  </p>
                ) : (
                  emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-md transition"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.relation} • {contact.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteContact(contact.id)}
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

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-sm font-semibold opacity-90">Profile Completeness</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {Math.round(
                    ((name ? 1 : 0) +
                      (phone ? 1 : 0) +
                      (email ? 1 : 0) +
                      (medicalInfo ? 1 : 0) +
                      (emergencyContacts.length > 0 ? 1 : 0)) /
                      5 *
                      100
                  )}
                </span>
                <span className="text-xl opacity-90">%</span>
              </div>
              <div className="mt-3 w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      ((name ? 1 : 0) +
                        (phone ? 1 : 0) +
                        (email ? 1 : 0) +
                        (medicalInfo ? 1 : 0) +
                        (emergencyContacts.length > 0 ? 1 : 0)) /
                        5 *
                        100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-sm font-semibold opacity-90">Emergency Contacts</p>
              <p className="mt-3 text-4xl font-bold">{emergencyContacts.length}</p>
              <p className="mt-2 text-sm opacity-90">Ready to protect you</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition">
              <p className="text-sm font-semibold opacity-90">Last Updated</p>
              <p className="mt-3 text-lg font-bold">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm opacity-90">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
