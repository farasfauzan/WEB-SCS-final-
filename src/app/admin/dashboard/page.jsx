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
  { label: "Statistics", href: "/admin/statistics", icon: "/icons/statistic.svg" },
  { label: "Settings", href: "/admin/settings", icon: "/icons/setting.svg" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [heroRes, aboutRes, projectRes, newsRes, contactRes, partnerRes, statRes, visitorRes] =
          await Promise.all([
            fetch("/api/hero"),
            fetch("/api/about"),
            fetch("/api/projects"),
            fetch("/api/news"),
            fetch("/api/contact"),
            fetch("/api/partners"),
            fetch("/api/statistics"),
            fetch("/api/visitor/stats"),
          ]);

        const heroes = await heroRes.json();
        const abouts = await aboutRes.json();
        const projects = await projectRes.json();
        const news = await newsRes.json();
        const contacts = await contactRes.json();
        const partners = await partnerRes.json();
        const statistics = await statRes.json();
        const visitorData = await visitorRes.json();

        setStats({
          heroes: heroes.heroes?.length || 0,
          abouts: abouts.abouts?.length || 0,
          projects: projects.projects?.length || 0,
          news: news.news?.length || 0,
          contacts: contacts.contacts?.length || 0,
          partners: partners.partners?.length || 0,
          statistics: statistics.statistics?.length || 0,
        });
        setVisitorStats(visitorData.stats || null);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const SECTIONS = [
    { label: "Hero Sections", count: stats?.heroes || 0, icon: "/icons/hero.svg", desc: "Homepage banners", href: "/admin/hero" },
    { label: "About Pages", count: stats?.abouts || 0, icon: "/icons/about.svg", desc: "Company profile", href: "/admin/about" },
    { label: "Projects", count: stats?.projects || 0, icon: "/icons/project.svg", desc: "Portfolio items", href: "/admin/projects" },
    { label: "News Articles", count: stats?.news || 0, icon: "/icons/news.svg", desc: "Announcements", href: "/admin/news" },
    { label: "Contacts", count: stats?.contacts || 0, icon: "/icons/contact.svg", desc: "Contact details", href: "/admin/contact" },
    { label: "Partners", count: stats?.partners || 0, icon: "/icons/partner.svg", desc: "Affiliations", href: "/admin/partners" },
  ];

  const visitorCards = [
    { label: "Total Kunjungan", count: visitorStats?.totalVisits || 0, icon: "/icons/eye.svg" },
    { label: "Pengunjung Unik", count: visitorStats?.uniqueVisitors || 0, icon: "/icons/admin.svg" },
    { label: "Hari Ini", count: visitorStats?.todayVisitors || 0, icon: "/icons/calendar.svg" },
    { label: "Minggu Ini", count: visitorStats?.weekVisitors || 0, icon: "/icons/chart.svg" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#004282] to-[#003366] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center shadow-sm">
            <CldImg src="/logo-scs.svg" alt="" className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-white/60 text-sm mt-0.5">Overview of your website content and visitors</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(6).fill(null).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse border border-neutral-200">
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
                      <CldImg src={section.icon} alt="" className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-700">{section.label}</p>
                      <p className="text-xs text-neutral-500">{section.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-neutral-800">{section.count}</p>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Visitor Stats */}
      {visitorStats && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#004282]" />
              <h2 className="text-sm font-bold text-neutral-700">Pengunjung Website</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-neutral-100">
            {visitorCards.map((card) => (
              <div key={card.label} className="p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#004282]/5 flex items-center justify-center mx-auto mb-2">
                  <CldImg src={card.icon} alt="" className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-neutral-800">{card.count.toLocaleString("id-ID")}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{card.label}</p>
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
              <h2 className="text-sm font-bold text-neutral-700">Quick Actions</h2>
            </div>
            <span className="text-xs text-neutral-500">Navigate to sections</span>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#004282]/5 hover:border-[#004282]/20 border border-transparent transition-all duration-150 group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#004282]/5 flex items-center justify-center group-hover:bg-[#004282]/10 transition-colors">
                <CldImg src={link.icon} alt="" className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-neutral-600 group-hover:text-[#004282] transition-colors">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
