"use client";

import { useState, useEffect } from "react";

const SETTING_GROUPS = [
  {
    group: "links",
    label: "Navigation Links",
    description: "Configure external links used in the navigation menu",
    fields: [
      { key: "youtube_url", label: "YouTube URL", placeholder: "https://youtube.com/@..." },
      { key: "portal_app_url", label: "Portal Aplikasi URL", placeholder: "https://..." },
      { key: "sop_url", label: "SOP URL", placeholder: "https://..." },
      { key: "anak_perusahaan_url", label: "Anak Perusahaan URL", placeholder: "https://..." },
    ],
  },
  {
    group: "footer",
    label: "Footer Settings",
    description: "Footer information displayed on all pages",
    fields: [
      { key: "footer_description", label: "Footer Description", placeholder: "Company description..." },
      { key: "footer_address", label: "Address", placeholder: "Jl. Karangrejo Barat No 09..." },
      { key: "footer_phone", label: "Phone Number", placeholder: "024 8502010" },
      { key: "footer_email", label: "Email", placeholder: "info@company.com" },
      { key: "footer_copyright", label: "Copyright Text", placeholder: "© 2026 PT. Sinar Cerah Sempurna" },
    ],
  },
  {
    group: "company",
    label: "Company Info",
    description: "Basic company information",
    fields: [
      { key: "company_name", label: "Company Name", placeholder: "PT Sinar Cerah Sempurna" },
      { key: "company_tagline", label: "Tagline", placeholder: "Memberi Kepuasan Kepada Relasi" },
    ],
  },
];

export default function SettingPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/setting");
        const data = await res.json();
        setSettings(data.settingsMap || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSetting = async (key, value) => {
    try {
      const group = SETTING_GROUPS.find((g) => g.fields.some((f) => f.key === key))?.group || "general";
      const label = SETTING_GROUPS.flatMap((g) => g.fields).find((f) => f.key === key)?.label || key;

      const res = await fetch("/api/setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, label, group }),
      });

      if (!res.ok) throw new Error("Failed to save");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    let success = true;
    for (const [key, value] of Object.entries(settings)) {
      const ok = await saveSetting(key, value);
      if (!ok) success = false;
    }

    setMessage({
      type: success ? "success" : "error",
      text: success ? "All settings saved successfully!" : "Some settings failed to save. Please try again.",
    });
    setSaving(false);

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleFieldSave = async (key) => {
    const ok = await saveSetting(key, settings[key]);
    setMessage({
      type: ok ? "success" : "error",
      text: ok ? "Saved!" : "Failed to save.",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <img src="/icons/setting.svg" alt="" className="w-5 h-5 text-[#004282]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-500 text-sm mt-1">Manage website links, footer content, and company information</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-[#004282] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving All..." : "Save All Changes"}
        </button>
      </div>

      {message.text && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === "success" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {SETTING_GROUPS.map((group) => (
          <div key={group.group} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">{group.label}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{group.description}</p>
            </div>

            <div className="p-6 space-y-5">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                    <button
                      onClick={() => handleFieldSave(field.key)}
                      className="text-xs text-[#004282] hover:text-blue-700 font-medium"
                    >
                      Save
                    </button>
                  </div>
                  <input
                    type="text"
                    value={settings[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-blue-800 mb-1">How Settings Work</h3>
        <p className="text-xs text-blue-600 leading-relaxed">
          These settings control the links in the navigation menu, footer content, and company info across your website.
          Changes take effect immediately on the public website. There is no need to edit any code to update these values.
        </p>
      </div>
    </div>
  );
}
