"use client";

import { useState, useEffect } from "react";
import CldImg from "@/components/shared/CldImg";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateText(text, max = 60) {
  if (!text) return "-";
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export default function AdminCommentsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showConfirmId, setShowConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusFilter !== "ALL") {
        params.set("approved", statusFilter === "APPROVED" ? "true" : "false");
      }
      const res = await fetch(`/api/comments?${params.toString()}`);
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [statusFilter]);

  const handleApprove = async (comment) => {
    setDeletingId(comment.id);
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id, approved: true }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === comment.id ? { ...c, approved: true } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setShowConfirmId(null);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <CldImg src="/icons/comment.svg" alt="" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Komentar</h1>
              <p className="text-gray-500 text-xs lg:text-sm mt-0.5">
                {pagination.total} komentar tercatat
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004282] bg-white"
          >
            <option value="ALL">Semua</option>
            <option value="PENDING">Menunggu</option>
            <option value="APPROVED">Disetujui</option>
          </select>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmId && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowConfirmId(null)}
        >
          <div
            className="bg-white p-5 max-w-[280px] w-full border border-gray-200 shadow-2xl rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Hapus Komentar?</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Komentar ini akan dihapus permanen dan tidak bisa dikembalikan.
                </p>
              </div>
              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => setShowConfirmId(null)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(showConfirmId)}
                  disabled={deletingId === showConfirmId}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deletingId === showConfirmId ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DESKTOP TABLE ===== */}
      {!isMobile && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Komentar</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Berita</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array(7).fill(null).map((__, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                      ))}
                    </tr>
                  ))
                ) : comments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">Belum ada komentar</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {comment.name || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {comment.email || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-sm text-gray-600 cursor-default"
                          title={comment.comment || ""}
                        >
                          {truncateText(comment.comment)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                        {comment.news?.title || comment.newsTitle || "-"}
                      </td>
                      <td className="px-5 py-4">
                        {comment.approved ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Disetujui
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!comment.approved && (
                            <button
                              onClick={() => handleApprove(comment)}
                              disabled={deletingId === comment.id}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Setujui"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => setShowConfirmId(comment.id)}
                            disabled={deletingId === comment.id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Hapus"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Desktop */}
          {pagination.totalPages > 1 && !loading && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Halaman {pagination.page} dari {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchComments(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => fetchComments(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== MOBILE CARDS ===== */}
      {isMobile && (
        <div className="space-y-3">
          {loading ? (
            Array(5).fill(null).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Belum ada komentar</p>
              </div>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004282] to-blue-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {(comment.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{comment.name || "Anonim"}</p>
                        <p className="text-[10px] text-gray-400">{comment.email || "-"}</p>
                      </div>
                    </div>
                    {comment.approved ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                        Disetujui
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-700">
                        Menunggu
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {comment.comment || "-"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    <span className="font-medium text-gray-500">Berita:</span> {comment.news?.title || comment.newsTitle || "-"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {formatDate(comment.createdAt)}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {!comment.approved && (
                      <button
                        onClick={() => handleApprove(comment)}
                        disabled={deletingId === comment.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Setujui
                      </button>
                    )}
                    <button
                      onClick={() => setShowConfirmId(comment.id)}
                      disabled={deletingId === comment.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination - Mobile */}
          {pagination.totalPages > 1 && !loading && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
              <p className="text-xs text-gray-500">Hal {pagination.page}/{pagination.totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchComments(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => fetchComments(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-blue-800 mb-1">Informasi</h3>
        <p className="text-xs text-blue-600 leading-relaxed">
          Halaman ini menampilkan semua komentar yang masuk dari pengunjung. Setujui komentar yang valid
          untuk ditampilkan di halaman berita. Komentar yang ditolak tidak akan muncul di halaman publik.
        </p>
      </div>
    </div>
  );
}
