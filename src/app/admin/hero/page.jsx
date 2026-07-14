"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

export default function HeroListPage() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroes = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      setHeroes(data.heroes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeroes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hero section?")) return;
    const res = await fetch(`/api/hero/${id}`, { method: "DELETE" });
    if (res.ok) fetchHeroes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CldImg src="/icons/hero.svg" alt="" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Hero Sections</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your homepage hero banners</p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/hero/create"
          className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors"
        >
          <CldImg src="/icons/plus.svg" alt="" className="w-4 h-4 brightness-0 invert" />
          Add Hero
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Page</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Created</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {heroes.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No hero sections yet. Create your first one!
                </td>
              </tr>
            ) : (
              heroes.map((hero) => (
                <tr key={hero.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-800">{hero.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 capitalize">{hero.page?.toLowerCase() || "home"}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${hero.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {hero.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(hero.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/hero/${hero.id}`}
                      className="text-[#004282] hover:text-blue-700 text-sm font-medium mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(hero.id)}
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
