"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

const ICON_MAP = {
  phone: "/icons/phone.svg",
  email: "/icons/envelope.svg",
  address: "/icons/map-pin.svg",
  general: "/icons/clock.svg",
  social: "/icons/clock.svg",
};

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    label: "",
    value: "",
    icon: "",
    type: "general",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // KOREKSI TYPO DI SINI:
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      const res = await fetch(`/api/contact/${params.id}`);
      const data = await res.json();
      if (data.contact) {
        const c = data.contact;
        setForm({
          label: c.label || "",
          value: c.value || "",
          icon: c.icon || "",
          type: c.type || "general",
        });
      }
      setLoading(false);
    };
    fetchContact();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/contact/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/contact");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { icon: ICON_MAP[value] || "" } : {}),
    }));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/contact"
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Contact</h1>
          <p className="text-gray-500 text-sm mt-1">Update contact detail</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Label *
            </label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm"
            >
              <option value="general">General</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="social">Social Media</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Value *
          </label>
          <input
            type="text"
            name="value"
            value={form.value}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Icon
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="Auto-filled from type"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm"
              />
              {form.icon && (
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <CldImg src={form.icon} alt="" className="w-5 h-5" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Auto-filled from type. You can change it manually.
            </p>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  icon: ICON_MAP[prev.type] || "",
                }))
              }
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#004282] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Reset Icon
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#004282] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/contact"
            className="text-center px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
