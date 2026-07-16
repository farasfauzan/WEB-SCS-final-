"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

const QUICK_LINKS = [
  { label: "Hero Section", href: "/admin/hero", icon: "/icons/hero.svg" },
  { label: "About", href: "/admin/about", icon: "/icons/about.svg" },
  { label: "Projects", href: "/admin/projects", icon: "/icons/project.svg" },
  { label: "News", href: "/admin/news", icon: "/icons/news.svg" },
  { label: "Contacts", href: "/admin/contact", icon: "/icons/contact.svg" },
  { label: "Partners", href: "/admin/partners", icon: "/icons/partner.svg" },
  {
    label: "Statistics",
    href: "/admin/statistics",
    icon: "/icons/statistic.svg",
  },
  { label: "Settings", href: "/admin/settings", icon: "/icons/setting.svg" },
  { label: "Activity Log", href: "/admin/logs", icon: "/icons/eye.svg" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // PERBAIKAN: Menggunakan .catch(e => ({})) di setiap fetch untuk memastikan
        // jika satu API gagal (misal tabel kosong/error), Promise.all tidak langsung hancur.
        const safeFetch = (url) =>
          fetch(url)
            .then((res) => res.json())
            .catch(() => ({}));

        const [
          heroes,
          abouts,
          projects,
          news,
          contacts,
          partners,
          statistics,
          visitorData,
        ] = await Promise.all([
          safeFetch("/api/hero"),
          safeFetch("/api/about"),
          safeFetch("/api/projects"),
          safeFetch("/api/news"),
          safeFetch("/api/contact"),
          safeFetch("/api/partners"),
          safeFetch("/api/statistics"),
          safeFetch("/api/visitor/stats"),
        ]);

        setStats({
          heroes: heroes.heroes?.length || 0,
          abouts: abouts.abouts?.length || 0,
          projects: projects.projects?.length || 0,
          news: news.news?.length || 0,
          contacts: contacts.contacts?.length || 0,
          partners: partners.partners?.length || 0,
          statistics: statistics.statistics?.length || 0,
        });

        // Memastikan fallback data pengunjung aman
        setVisitorStats(
          visitorData.stats || {
            totalVisits: 0,
            uniqueVisitors: 0,
            todayVisitors: 0,
            weekVisitors: 0,
          },
        );
      } catch (err) {
        console.error("Critical failure loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const SECTIONS = [
    {
      label: "Hero Sections",
      count: stats?.heroes || 0,
      icon: "/icons/hero.svg",
      desc: "Homepage banners",
      href: "/admin/hero",
    },
    {
      label: "About Pages",
      count: stats?.abouts || 0,
      icon: "/icons/about.svg",
      desc: "Company profile",
      href: "/admin/about",
    },
    {
      label: "Projects",
      count: stats?.projects || 0,
      icon: "/icons/project.svg",
      desc: "Portfolio items",
      href: "/admin/projects",
    },
    {
      label: "News Articles",
      count: stats?.news || 0,
      icon: "/icons/news.svg",
      desc: "Announcements",
      href: "/admin/news",
    },
    {
      label: "Contacts",
      count: stats?.contacts || 0,
      icon: "/icons/contact.svg",
      desc: "Contact details",
      href: "/admin/contact",
    },
    {
      label: "Partners",
      count: stats?.partners || 0,
      icon: "/icons/partner.svg",
      desc: "Affiliations",
      href: "/admin/partners",
    },
  ];

  const visitorCards = [
    {
      label: "Total Kunjungan",
      count: visitorStats?.totalVisits || 0,
      icon: "/icons/eye.svg",
    },
    {
      label: "Pengunjung Unik",
      count: visitorStats?.uniqueVisitors || 0,
      icon: "/icons/admin.svg",
    },
    {
      label: "Hari Ini",
      count: visitorStats?.todayVisitors || 0,
      icon: "/icons/calendar.svg",
    },
    {
      label: "Minggu Ini",
      count: visitorStats?.weekVisitors || 0,
      icon: "/icons/chart.svg",
    },
  ];

  const handleResetVisitor = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/visitor/reset", { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset");
      setVisitorStats({
        totalVisits: 0,
        uniqueVisitors: 0,
        todayVisitors: 0,
        weekVisitors: 0,
      });
    } catch (err) {
      console.error("Reset error:", err);
      alert(
        "Gagal mereset data pengunjung. Silakan periksa koneksi atau log server.",
      );
    } finally {
      setResetting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#004282] to-[#003366] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center shadow-sm">
            {/* Fallback statis jika logo gagal muat */}
            <img
              src="/logo-scs.svg"
              alt="Logo SCS"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-white/60 text-sm mt-0.5">
              Overview of your website content and visitors
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(6)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 animate-pulse border border-neutral-200"
                >
                  <div className="h-4 bg-neutral-100 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-neutral-100 rounded w-1/3"></div>
                </div>
              ))
          : SECTIONS.map((section) => (
              <Link
                key={section.label}
                href={section.href}
                className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm hover:shadow-md hover:border-[#004282]/30 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#004282]/10 flex items-center justify-center group-hover:bg-[#004282]/15 transition-colors">
                      <img
                        src={section.icon}
                        alt={section.label}
                        className="w-5 h-5 opacity-70"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-700">
                        {section.label}
                      </p>
                      <p className="text-xs text-neutral-500">{section.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-neutral-800">
                      {section.count}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Visitor Stats */}
      {!loading && visitorStats && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#004282]" />
                <h2 className="text-sm font-bold text-neutral-700">
                  Pengunjung Website
                </h2>
              </div>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={resetting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {resetting ? "Resetting..." : "Reset"}
              </button>
            </div>
          </div>

          {/* PERBAIKAN: z-[60] memastikan modal konfirmasi selalu berada di atas segalanya termasuk sidebar mobile */}
          {showConfirm && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            >
              <div
                className="bg-white p-5 max-w-[280px] mx-4 border border-neutral-200 shadow-2xl rounded-2xl transform transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-800">
                      Reset Data?
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                      Semua data riwayat kunjungan akan dihapus secara permanen.
                      Tindakan ini mutlak.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full pt-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleResetVisitor}
                      disabled={resetting}
                      className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {resetting ? "Memproses..." : "Ya, Reset"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-neutral-100">
            {visitorCards.map((card) => (
              <div key={card.label} className="p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#004282]/5 flex items-center justify-center mx-auto mb-3">
                  <img
                    src={card.icon}
                    alt={card.label}
                    className="w-5 h-5 opacity-70"
                  />
                </div>
                <p className="text-2xl font-bold text-neutral-800">
                  {card.count.toLocaleString("id-ID")}
                </p>
                <p className="text-xs font-medium text-neutral-500 mt-1">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#004282]" />
              <h2 className="text-sm font-bold text-neutral-700">
                Quick Actions
              </h2>
            </div>
            <span className="text-xs text-neutral-500">
              Shortcut navigasi menu
            </span>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#004282]/5 hover:border-[#004282]/20 border border-transparent transition-all duration-150 group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#004282]/5 flex items-center justify-center group-hover:bg-[#004282]/15 transition-colors">
                <img
                  src={link.icon}
                  alt={link.label}
                  className="w-4 h-4 opacity-70"
                />
              </div>
              <span className="text-xs font-semibold text-neutral-600 group-hover:text-[#004282] transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
