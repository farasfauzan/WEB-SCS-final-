"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

export default function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) fetchContacts();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CldImg src="/icons/contact.svg" alt="" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Contact Information</h1>
              <p className="text-gray-500 text-sm mt-1">Manage contact details shown on the website</p>
            </div>
          </div>
        </div>
        <Link href="/admin/contact/create" className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
          <CldImg src="/icons/plus.svg" alt="" className="w-4 h-4 brightness-0 invert" />
          Add Contact
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array(4).fill(null).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : contacts.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
            No contacts yet. Add your first contact detail.
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CldImg src={contact.icon || "/icons/contact.svg"} alt="" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{contact.label}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{contact.value}</p>
                    <span className="text-xs text-gray-500 mt-1 block">{contact.type}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/contact/${contact.id}`} className="text-[#004282] hover:text-blue-700 text-sm font-medium">Edit</Link>
                  <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
