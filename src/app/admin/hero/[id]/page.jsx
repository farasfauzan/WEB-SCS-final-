"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditHeroPage() {
  const router = useRouter();
  const params = useParams();
  const PAGES = [
    { value: "home", label: "Beranda" },
    { value: "about", label: "Tentang Kami" },
    { value: "projects", label: "Proyek" },
    { value: "news", label: "Berita" },
  ];

  const [form, setForm] = useState({
    page: "HOME",
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    heroImage2: "",
    heroImage3: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHero = async () => {
      const res = await fetch(`/api/hero/${params.id}`);
      const data = await res.json();
      if (data.hero) {
        setForm({
          page: data.hero.page || "home",
          title: data.hero.title || "",
          subtitle: data.hero.subtitle || "",
          description: data.hero.description || "",
          imageUrl: data.hero.imageUrl || "",
          heroImage2: "",
          heroImage3: "",
          isActive: data.hero.isActive ?? true,
        });

        // Fetch settings for hero small images (only if page is home)
        if (data.hero.page === "home" || !data.hero.page) {
          try {
            const settingsRes = await fetch("/api/settings");
            const settingsData = await settingsRes.json();
            if (settingsData.settingsMap) {
              setForm((prev) => ({
                ...prev,
                heroImage2: settingsData.settingsMap["hero_home_image2"] || "",
                heroImage3: settingsData.settingsMap["hero_home_image3"] || "",
              }));
            }
          } catch (e) {
            console.error("Failed to fetch hero settings:", e);
          }
        }
      }
      setLoading(false);
    };
    fetchHero();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Save hero data
      const heroRes = await fetch(`/api/hero/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: form.page,
          title: form.title,
          subtitle: form.page === "home" ? form.subtitle : "",
          description: form.description,
          imageUrl: form.imageUrl,
          isActive: form.isActive,
        }),
      });

      if (!heroRes.ok) {
        const heroData = await heroRes.json();
        throw new Error(heroData.error || "Failed to update");
      }

      // Save hero small images (for home page) to settings
      if (form.page === "home") {
        const saveSetting = async (key, value) => {
          await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key,
              value,
              label: key === "hero_home_image2" ? "Hero Foto Kecil 1" : "Hero Foto Kecil 2",
              group: "hero",
            }),
          });
        };
        await Promise.all([
          saveSetting("hero_home_image2", form.heroImage2),
          saveSetting("hero_home_image3", form.heroImage3),
        ]);
      }

      router.push("/admin/hero");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  const isHomePage = form.page === "home";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/hero" className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Hero Section</h1>
          <p className="text-gray-500 text-sm mt-1">Update your hero banner</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Page *</label>
          <select name="page" value={form.page} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm">
            {PAGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
        </div>

        {isHomePage && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
            <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
        </div>

        <ImageUpload
          currentImage={form.imageUrl}
          onImageChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
          label="Hero Image (Background)"
        />

        {isHomePage && (
          <>
            <hr className="border-gray-200" />
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Foto Konstruksi Kecil</h3>
              <p className="text-xs text-gray-500 mb-3">Dua foto kecil yang muncul di sisi kanan hero section Beranda.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUpload
                  currentImage={form.heroImage2}
                  onImageChange={(url) => setForm((prev) => ({ ...prev, heroImage2: url }))}
                  label="Foto Konstruksi 1"
                />
                <ImageUpload
                  currentImage={form.heroImage3}
                  onImageChange={(url) => setForm((prev) => ({ ...prev, heroImage3: url }))}
                  label="Foto Konstruksi 2"
                />
              </div>
            </div>
          </>
        )}

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
          <Link href="/admin/hero"
            className="text-center px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
