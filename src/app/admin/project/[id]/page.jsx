"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORIES = ["Rumah Sakit", "Gedung Pendidikan", "Pusat Perbelanjaan", "Lainnya"];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ title: "", description: "", category: "Lainnya", location: "", client: "", imageUrl: "", completedDate: "", isActive: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`/api/project/${params.id}`);
      const data = await res.json();
      if (data.project) {
        const p = data.project;
        setForm({ title: p.title || "", description: p.description || "", category: p.category || "Lainnya", location: p.location || "", client: p.client || "", imageUrl: p.imageUrl || "", completedDate: p.completedDate || "", isActive: p.isActive ?? true });
      }
      setLoading(false);
    };
    fetchProject();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/project/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/project");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/project" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Project</h1>
          <p className="text-gray-500 text-sm mt-1">Update project details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Completed Date</label>
            <input type="text" name="completedDate" value={form.completedDate} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
            <input type="text" name="client" value={form.client} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
          </div>
        </div>

        <ImageUpload
          currentImage={form.imageUrl}
          onImageChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
          label="Project Image"
        />

        <div className="flex items-center gap-3">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange}
            className="w-4 h-4 text-[#004282] rounded focus:ring-[#004282]" />
          <label className="text-sm font-medium text-gray-700">Active (visible on website)</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#004282] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/project" className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
