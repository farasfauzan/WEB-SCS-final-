"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "/icons/dashboard.svg" },
  { label: "Hero Section", href: "/admin/hero", icon: "/icons/hero.svg" },
  { label: "About", href: "/admin/about", icon: "/icons/about.svg" },
  { label: "Projects", href: "/admin/projects", icon: "/icons/project.svg" },
  { label: "News", href: "/admin/news", icon: "/icons/news.svg" },
  { label: "Contact", href: "/admin/contact", icon: "/icons/contact.svg" },
  { label: "Partners", href: "/admin/partners", icon: "/icons/partner.svg" },
  { label: "Statistics", href: "/admin/statistics", icon: "/icons/statistic.svg" },
  { label: "Settings", href: "/admin/settings", icon: "/icons/setting.svg" },
  { label: "Evaluasi User", href: "/admin/evaluations", icon: "/icons/about.svg" },
  { label: "Admin Users", href: "/admin/users", icon: "/icons/admin.svg" },
  { label: "Comments", href: "/admin/comments", icon: "/icons/eye.svg" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "/icons/contact.svg" },
  { label: "Revisions", href: "/admin/revisions", icon: "/icons/eye.svg" },
  { label: "Activity Log", href: "/admin/logs", icon: "/icons/eye.svg" },
  { label: "Error Logs", href: "/admin/error-logs", icon: "/icons/eye.svg" },
];

function SidebarContent({ pathname, admin, onLinkClick }) {
  return (
    <div className="flex flex-col h-full">
      {/* HEADER: Logo + Brand */}
      <div className="px-5 py-4 border-b border-gray-200 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onLinkClick}>
          <CldImg src="/logo-scs.svg" alt="SCS" className="w-10 h-10 object-contain shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">SCS Admin</span>
            <span className="text-[10px] text-gray-500 font-medium">CMS Panel</span>
          </div>
        </Link>
      </div>

      {/* PROFILE: Avatar + Name + Role */}
      {admin && (
        <div className="px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-300 flex items-center justify-center text-[#004282] font-bold text-sm shrink-0">
              {admin.username?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700">{admin.username}</p>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION: Vertical menu list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-[6px]">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#004282]/10 text-[#004282]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <CldImg src={item.icon} alt="" className="w-5 h-5 shrink-0 brightness-0 opacity-50" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) {
          setAdmin(data.admin);
        } else {
          router.push("/admin/login");
        }
      })
      .catch((err) => { console.warn("Auth check failed:", err); router.push("/admin/login"); })
      .finally(() => setLoading(false));
  }, [isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!admin) {
    return null;
  }

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {/* Root layout: full viewport height, horizontal flex */}
      <div className="h-screen bg-gray-100 flex overflow-hidden">
        {/* ===== DESKTOP SIDEBAR =====
            - Hidden on mobile, shown on lg+
            - In normal flex flow (not fixed), so content naturally sits to the right
        */}
        <aside className="hidden lg:flex lg:flex-col w-[280px] bg-white border-r border-gray-200 text-gray-700 shadow-sm overflow-y-auto flex-shrink-0">
          <SidebarContent
            pathname={pathname}
            admin={admin}
            onLinkClick={() => setSidebarOpen(false)}
          />
        </aside>

        {/* ===== MOBILE SIDEBAR (Drawer) =====
            - Fixed overlay, hidden on lg+
            - Slides in/out with transform
        */}
        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-200 text-gray-700 shadow-sm overflow-y-auto
            flex flex-col
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:hidden
          `}
        >
          <SidebarContent
            pathname={pathname}
            admin={admin}
            onLinkClick={() => setSidebarOpen(false)}
          />
        </aside>

        {/* ===== MAIN CONTENT AREA =====
            - flex-1 fills remaining width (desktop sidebar already takes 256px in flow)
            - No ml-64 needed — sidebar takes its natural space in the flex layout
        */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-3 lg:px-8 py-2.5 lg:py-3 flex items-center justify-between shadow-sm flex-shrink-0 min-h-[56px]">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 shrink-0"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-base lg:text-lg font-bold text-gray-800 truncate">
                Admin Panel
              </h1>
            </div>

            <div className="flex items-center gap-1.5 lg:gap-4 shrink-0">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs lg:text-sm text-gray-500 hover:text-[#004282] transition-colors px-2 lg:px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium"
              >
                <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <div className="w-px h-5 lg:h-6 bg-gray-200 hidden sm:block"></div>
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  setAdmin(null);
                  router.push("/admin/login");
                }}
                className="inline-flex items-center gap-1 text-xs lg:text-sm text-red-500 hover:text-red-600 px-2 lg:px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Page Content - scrollable area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
