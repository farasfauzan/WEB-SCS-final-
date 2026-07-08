"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NewsListPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data.news || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (res.ok) fetchNews();
  };

  const handleStatusToggle = async (item) => {
    const newStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/news/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        publishedAt: newStatus === "PUBLISHED" ? new Date().toISOString() : null,
      }),
    });
    fetchNews();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <img src="/icons/news.svg" alt="" className="w-5 h-5 text-[#004282]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">News Articles</h1>
              <p className="text-gray-500 text-sm mt-1">Manage news and announcements</p>
            </div>
          </div>
        </div>
        <Link href="/admin/news/create" className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
          <img src="/icons/plus.svg" alt="" className="w-4 h-4 brightness-0 invert" />
          Add News
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Published</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Created</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No news articles yet.</td></tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-800">{item.title}</td>
                  <td className="p-4">
                    <button onClick={() => handleStatusToggle(item)}
                      className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                        item.status === "PUBLISHED" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                      }`}>
                      {item.status}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "-"}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/news/${item.id}`} className="text-[#004282] hover:text-blue-700 text-sm font-medium mr-3">Edit</Link>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
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
