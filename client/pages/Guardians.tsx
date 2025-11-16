import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Heart, Phone, Mail, Trash2, Star, Plus } from "lucide-react";

type Guardian = { id: string; name: string; phone: string; email?: string; primary?: boolean };

export default function Guardians() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("guardians:v1");
      if (raw) setGuardians(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("guardians:v1", JSON.stringify(guardians));
  }, [guardians]);

  const addGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Please enter name and phone");
      return;
    }

    if (!email?.trim() || !email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    const g: Guardian = { id: Date.now().toString(), name, phone, email };
    setGuardians((s) => [g, ...s]);
    setName("");
    setPhone("");
    setEmail("");
    setShowForm(false);
    alert(`✅ ${g.name} added as guardian!`);
  };

  const removeGuardian = (id: string) => {
    setGuardians((s) => s.filter((g) => g.id !== id));
    alert("Guardian removed");
  };

  const togglePrimary = (id: string) => {
    setGuardians((s) => s.map((g) => ({ ...g, primary: g.id === id ? !g.primary : g.primary })));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 py-12">
        <div className="container mx-auto px-4 lg:px-20">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-4">
              <Heart size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-3">
              My Guardians
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Trusted people who receive alerts during emergencies and can monitor your safety
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Guardians List */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Guardians</h2>
                
                <div className="space-y-4">
                  {guardians.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 text-lg">No guardians added yet</p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Add trusted contacts to be notified during emergencies</p>
                    </div>
                  ) : (
                    guardians.map((g) => (
                      <div key={g.id} className="group p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{g.name}</h3>
                              {g.primary && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 font-bold text-xs rounded-full">
                                  <Star size={12} fill="currentColor" /> PRIMARY
                                </span>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Phone size={16} className="text-blue-600 dark:text-blue-400" />
                                <a href={`tel:${g.phone}`} className="hover:text-blue-600 dark:hover:text-blue-300 font-semibold">{g.phone}</a>
                              </div>
                              {g.email && (
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                  <Mail size={16} className="text-indigo-600 dark:text-indigo-400" />
                                  <a href={`mailto:${g.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold">{g.email}</a>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => togglePrimary(g.id)}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                g.primary
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                              }`}
                            >
                              {g.primary ? 'Unset' : 'Set Primary'}
                            </button>
                            <button 
                              onClick={() => removeGuardian(g.id)}
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 text-sm">
                  💡 <span className="font-semibold">Tip:</span> Mark one guardian as primary for priority notifications during emergencies.
                </div>
              </div>
            </div>

            {/* Add Guardian Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Plus size={28} />
                  Add Guardian
                </h3>

                <form onSubmit={addGuardian} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 opacity-90">Full Name *</label>
                    <input 
                      type="text"
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 opacity-90">Phone Number *</label>
                    <input 
                      type="tel"
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="+91 90000 00000"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 opacity-90">Email Address *</label>
                    <input 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="guardian@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl active:scale-95 mt-6"
                  >
                    ✓ Add Guardian
                  </button>

                  {guardians.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full py-2 bg-white/20 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all"
                    >
                      Close
                    </button>
                  )}
                </form>

                <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20 text-xs opacity-90">
                  📌 All guardians are stored securely on your device. Connect a backend database to sync across devices.
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {guardians.length > 0 && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md text-center border-2 border-blue-200 dark:border-blue-800">
                <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{guardians.length}</p>
                <p className="text-slate-600 dark:text-slate-400 font-semibold mt-2">Total Guardians</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md text-center border-2 border-amber-200 dark:border-amber-800">
                <p className="text-4xl font-black text-amber-600 dark:text-amber-400">{guardians.filter(g => g.primary).length}</p>
                <p className="text-slate-600 dark:text-slate-400 font-semibold mt-2">Primary</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md text-center border-2 border-green-200 dark:border-green-800">
                <p className="text-4xl font-black text-green-600 dark:text-green-400">{guardians.filter(g => g.email).length}</p>
                <p className="text-slate-600 dark:text-slate-400 font-semibold mt-2">With Email</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md text-center border-2 border-purple-200 dark:border-purple-800">
                <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{guardians.filter(g => g.phone).length}</p>
                <p className="text-slate-600 dark:text-slate-400 font-semibold mt-2">With Phone</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
