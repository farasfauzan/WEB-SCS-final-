"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminListPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("/api/admin");
        const data = await res.json();
        setAdmins(data.admins || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [refreshTrigger]);

  const handleDelete = async (id, username) => {
    if (!confirm(`Are you sure you want to delete admin "${username}"?`))
      return;
    const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRefreshTrigger((prev) => prev + 1);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete admin");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Admin Users</h1>
          <p className="text-gray-500 text-xs lg:text-sm mt-0.5">
            Manage CMS administrator accounts
          </p>
        </div>
        <Link
          href="/admin/users/create"
          className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
        </Link>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      {!isMobile && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Username</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Created</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">No admin users yet.</td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#004282]/10 rounded-full flex items-center justify-center text-[#004282] font-bold text-sm shrink-0">
                            {admin.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{admin.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(admin.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <Link href={`/admin/users/${admin.id}`} className="text-[#004282] hover:text-blue-700 text-sm font-medium mr-3">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(admin.id, admin.username)} className="text-red-500 hover:text-red-600 text-sm font-medium">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== MOBILE CARDS ===== */}
      {isMobile && (
        <div className="space-y-3">
          {admins.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
              No admin users yet.
            </div>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#004282]/10 rounded-full flex items-center justify-center text-[#004282] font-bold shrink-0">
                      {admin.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{admin.username}</p>

                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Created: {new Date(admin.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <Link
                      href={`/admin/users/${admin.id}`}
                      className="flex-1 text-center text-sm font-semibold text-white bg-[#004282] px-3 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(admin.id, admin.username)}
                      className="flex-1 text-sm font-semibold text-red-500 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
