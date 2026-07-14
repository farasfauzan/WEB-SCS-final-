"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminListPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async (id, username) => {
    if (!confirm(`Are you sure you want to delete admin "${username}"?`)) return;
    const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchAdmins();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete admin");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage CMS administrator accounts</p>
        </div>
        <Link
          href="/admin/users/create"
          className="bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors"
        >
          + Add Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Username</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Role</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Created</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No admin users yet.</td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#004282]/10 rounded-full flex items-center justify-center text-[#004282] font-bold text-sm">
                        {admin.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{admin.username}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.role === "ADMIN"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/users/${admin.id}`}
                      className="text-[#004282] hover:text-blue-700 text-sm font-medium mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(admin.id, admin.username)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
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
  );
}
