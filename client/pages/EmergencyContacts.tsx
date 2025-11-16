import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { emergencyContacts as emergencyContactsApi } from "@/lib/api";
import { Loader } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
  priority: "high" | "medium" | "low";
  email?: string;
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Contact, "id">>({
    name: "",
    phone: "",
    relationship: "",
    priority: "high",
    email: "",
  });

  const { toast } = useToast();

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await emergencyContactsApi.getAll();
      setContacts(response.contacts || []);
    } catch (error: any) {
      console.error('Failed to load contacts:', error);
      toast({ title: "Error", description: error.message || "Failed to load contacts", variant: "destructive" });
      // Fallback to localStorage
      const saved = localStorage.getItem("emergencyContacts");
      if (saved) setContacts(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.relationship) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await emergencyContactsApi.update(
          editingId,
          formData.name,
          formData.phone,
          formData.relationship,
          formData.priority,
          formData.email || ""
        );
        setContacts(contacts.map(c => c.id === editingId ? { ...c, ...formData, id: editingId } : c));
        toast({ title: "Success", description: "Contact updated successfully" });
      } else {
        const response = await emergencyContactsApi.create(
          formData.name,
          formData.phone,
          formData.relationship,
          formData.priority,
          formData.email
        );
        setContacts([...contacts, { ...formData, id: response.contact_id }]);
        toast({ title: "Success", description: "Contact added successfully" });
      }
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save contact", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await emergencyContactsApi.delete(id);
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      toast({ title: "Success", description: "Contact deleted" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete contact", variant: "destructive" });
    }
  };

  const handleEdit = (contact: Contact) => {
    setFormData({ name: contact.name, phone: contact.phone, relationship: contact.relationship, priority: contact.priority, email: contact.email });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", relationship: "", priority: "high", email: "" });
    setEditingId(null);
    setIsAdding(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <span className="text-3xl">📞</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Emergency Contacts
            </h2>
          </div>
          <p className="text-muted-foreground text-lg mb-8">
            Manage your emergency contacts for quick access during critical situations
          </p>

          {/* Add Contact Form */}
          {isAdding && (
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
              <h3 className="text-2xl font-bold mb-6">{editingId ? "Edit Contact" : "Add New Contact"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-red-500 transition"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-red-500 transition"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g., Mother, Friend)"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-red-500 transition"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-red-500 transition"
                />
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as "high" | "medium" | "low" })}
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:border-red-500 transition md:col-span-2"
                >
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟠 Medium Priority</option>
                  <option value="low">🟡 Low Priority</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  {editingId ? "Update Contact" : "Add Contact"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="mb-8 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
            >
              + Add New Contact
            </button>
          )}

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-2xl text-muted-foreground">📭 No contacts yet</p>
                <p className="text-muted-foreground mt-2">Add your first emergency contact to get started</p>
              </div>
            ) : (
              contacts
                .sort((a, b) => (a.priority === "high" ? -1 : b.priority === "high" ? 1 : 0))
                .map((contact) => (
                  <div
                    key={contact.id}
                    className={`bg-gradient-to-br ${getPriorityColor(contact.priority)} p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition transform hover:scale-105`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold">{contact.name}</h4>
                        <p className="text-sm opacity-90">{contact.relationship}</p>
                      </div>
                      <span className="text-3xl">👤</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="text-sm opacity-90">
                        <strong>📱</strong> {contact.phone}
                      </p>
                      {contact.email && (
                        <p className="text-sm opacity-90">
                          <strong>✉️</strong> {contact.email}
                        </p>
                      )}
                      <p className="text-sm opacity-90">
                        <strong>⚡</strong> {contact.priority === "high" ? "High Priority" : contact.priority === "medium" ? "Medium Priority" : "Low Priority"}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="flex-1 px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Quick Call Buttons */}
          {contacts.length > 0 && (
            <div className="mt-12 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-6">Quick Call</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contacts
                  .filter((c) => c.priority === "high")
                  .slice(0, 4)
                  .map((contact) => (
                    <a
                      key={contact.id}
                      href={`tel:${contact.phone}`}
                      className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition text-center"
                    >
                      📱 {contact.name}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
