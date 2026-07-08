"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

export default function CreateNewsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    status: "DRAFT",
    publishedAt: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          publishedAt: form.status === "PUBLISHED" ? new Date().toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/news");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/news" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create News Article</h1>
          <p className="text-gray-500 text-sm mt-1">Add a new news article</p>
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
          <input type="text" name="slug" value={form.slug} onChange={handleChange} required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
          <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Must be unique.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Content *</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={6} required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <ImageUpload
              currentImage={form.imageUrl}
              onImageChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
              label="News Image"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-[#004282] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Create News"}
          </button>
          <Link href="/admin/news" className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
