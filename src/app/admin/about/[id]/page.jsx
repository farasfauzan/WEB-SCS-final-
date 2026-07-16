"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const NILAI_DEFAULTS = [
  { key: "nilai_1", titleKey: "nilai_1_title", descKey: "nilai_1_desc", iconKey: "nilai_1_icon", defaultTitle: "Integritas", defaultDesc: "Kami menjalankan bisnis dengan kejujuran, transparansi, dan tanggung jawab penuh dalam setiap aspek operasional kami.", defaultIcon: "/integritas.svg" },
  { key: "nilai_2", titleKey: "nilai_2_title", descKey: "nilai_2_desc", iconKey: "nilai_2_icon", defaultTitle: "Kualitas", defaultDesc: "Kami berkomitmen pada standar kualitas tertinggi dalam setiap proyek, ensuring hasil yang melampaui ekspektasi klien.", defaultIcon: "/kualitas.svg" },
  { key: "nilai_3", titleKey: "nilai_3_title", descKey: "nilai_3_desc", iconKey: "nilai_3_icon", defaultTitle: "Inovasi", defaultDesc: "Kami terus mengeksplorasi teknologi dan metode konstruksi terbaru untuk memberikan solusi yang lebih efisien dan berkelanjutan.", defaultIcon: "/inovasi.svg" },
  { key: "nilai_4", titleKey: "nilai_4_title", descKey: "nilai_4_desc", iconKey: "nilai_4_icon", defaultTitle: "Kerja Sama Tim", defaultDesc: "Kami percaya bahwa kolaborasi yang kuat antar tim adalah kunci keberhasilan setiap proyek yang kami kerjakan.", defaultIcon: "/kerja-sama-tim.svg" },
];

export default function EditAboutPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ title: "", subtitle: "", content: "", vision: "", mission: "" });
  const [nilaiForm, setNilaiForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch about data
        const aboutRes = await fetch(`/api/about/${params.id}`);
        const aboutData = await aboutRes.json();
        if (aboutData.about) {
          const a = aboutData.about;
          setForm({ title: a.title || "", subtitle: a.subtitle || "", content: a.content || "", vision: a.vision || "", mission: a.mission || "" });
        }

        // Fetch settings for nilai values
        const settingsRes = await fetch("/api/settings");
        const settingsData = await settingsRes.json();
        const sm = settingsData.settingsMap || {};

        const nilai = {};
        NILAI_DEFAULTS.forEach((n) => {
          nilai[n.titleKey] = sm[n.titleKey] || "";
          nilai[n.descKey] = sm[n.descKey] || "";
        });
        setNilaiForm(nilai);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Save about data
      const aboutRes = await fetch(`/api/about/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!aboutRes.ok) throw new Error((await aboutRes.json()).error);

      // Save nilai values to settings
      const savePromises = NILAI_DEFAULTS.flatMap((n) => [
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: n.titleKey, value: nilaiForm[n.titleKey], label: `Judul ${n.defaultTitle}`, group: "nilai" }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: n.descKey, value: nilaiForm[n.descKey], label: `Deskripsi ${n.defaultTitle}`, group: "nilai" }),
        }),
      ]);

      await Promise.all(savePromises);
      router.push("/admin/about");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNilaiChange = (key, value) => setNilaiForm((prev) => ({ ...prev, [key]: value }));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Edit About Page</h1>
        <p className="text-gray-500 text-sm mt-1">Update about page content, visi, misi, dan nilai-nilai perusahaan</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
            <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Vision</label>
            <textarea name="vision" value={form.vision} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mission</label>
            <textarea name="mission" value={form.mission} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Fondasi Utama Keunggulan Kami */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Fondasi Utama Keunggulan Kami</h3>
          <p className="text-xs text-gray-500 mb-4">Edit nilai-nilai inti perusahaan yang ditampilkan di halaman Tentang Kami.</p>
          
          <div className="space-y-6">
            {NILAI_DEFAULTS.map((n) => (
              <div key={n.key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-3">{n.defaultTitle}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Judul</label>
                    <input
                      type="text"
                      value={nilaiForm[n.titleKey] || ""}
                      onChange={(e) => handleNilaiChange(n.titleKey, e.target.value)}
                      placeholder={n.defaultTitle}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Deskripsi</label>
                    <textarea
                      value={nilaiForm[n.descKey] || ""}
                      onChange={(e) => handleNilaiChange(n.descKey, e.target.value)}
                      placeholder={n.defaultDesc}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#004282] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
