"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

export default function AboutListPage() {
  const [abouts, setAbouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAbouts = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setAbouts(data.abouts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAbouts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this about page?")) return;
    const res = await fetch(`/api/about/${id}`, { method: "DELETE" });
    if (res.ok) fetchAbouts();
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
              <CldImg src="/icons/about.svg" alt="" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">About Pages</h1>
              <p className="text-gray-500 text-sm mt-1">Manage about page content including vision & mission</p>
            </div>
          </div>
        </div>
        <Link href="/admin/about/create" className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
          <CldImg src="/icons/plus.svg" alt="" className="w-4 h-4 brightness-0 invert" />
          Add About
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Subtitle</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Created</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {abouts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No about pages yet.</td>
              </tr>
            ) : (
              abouts.map((about) => (
                <tr key={about.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-800">{about.title}</td>
                  <td className="p-4 text-sm text-gray-500">{about.subtitle || "-"}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(about.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/about/${about.id}`} className="text-[#004282] hover:text-blue-700 text-sm font-medium mr-3">Edit</Link>
                    <button onClick={() => handleDelete(about.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
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
