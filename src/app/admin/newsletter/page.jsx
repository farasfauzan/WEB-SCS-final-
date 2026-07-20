"use client";

import { useState, useEffect, useMemo } from "react";
import CldImg from "@/components/shared/CldImg";

const PAGE_SIZE = 10;

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/newsletter");
        const data = await res.json();
        setSubscribers(data.subscribers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, [refreshTrigger]);

  useEffect(() => {
    setPage(1);
  }, [subscribers.length]);

  const totalPages = Math.max(1, Math.ceil(subscribers.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return subscribers.slice(start, start + PAGE_SIZE);
  }, [subscribers, page]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to unsubscribe this email?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/newsletter?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRefreshTrigger((prev) => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to unsubscribe");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <CldImg src="/icons/email.svg" alt="" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Newsletter Subscribers
            </h1>
            <p className="text-gray-500 text-xs lg:text-sm mt-0.5">
              Manage newsletter email subscribers
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      {!isMobile && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Waktu</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">Belum ada subscriber</td>
                  </tr>
                ) : (
                  paginated.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(sub.subscribedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-800">{sub.email}</td>
                      <td className="p-4">
                        {sub.isActive !== false ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(sub.id)}
                          disabled={deletingId === sub.id}
                          className="text-red-500 hover:text-red-600 text-sm font-medium disabled:opacity-50"
                        >
                          {deletingId === sub.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {subscribers.length > PAGE_SIZE && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== MOBILE CARDS ===== */}
      {isMobile && (
        <div className="space-y-3">
          {subscribers.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
              Belum ada subscriber
            </div>
          ) : (
            paginated.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{sub.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(sub.subscribedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {sub.isActive !== false ? (
                      <span className="shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="flex-1 text-sm font-semibold text-red-500 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === sub.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Mobile Pagination */}
          {subscribers.length > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
