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
    second: "2-digit",
  });
}

function formatUserAgent(ua) {
  if (!ua) return "-";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return ua.length > 50 ? ua.substring(0, 50) + "..." : ua;
}

function truncateMessage(msg, max = 80) {
  if (!msg) return "-";
  if (msg.length <= max) return msg;
  return msg.substring(0, max) + "...";
}

const METHOD_COLORS = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function AdminErrorLogsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/error-logs?page=${page}&limit=20`);
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const filteredLogs = methodFilter === "ALL" ? logs : logs.filter((l) => l.method === methodFilter);

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/error-logs", { method: "DELETE" });
      if (res.ok) {
        setLogs([]);
        setPagination({ page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#004282]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Error Logs</h1>
              <p className="text-gray-500 text-xs lg:text-sm mt-0.5">
                {pagination.total} error tercatat
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004282] bg-white"
          >
            <option value="ALL">Semua Method</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          {pagination.total > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Hapus Semua</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowConfirm(false)}
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
                <h3 className="text-base font-bold text-gray-800">Hapus Semua Error Log?</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Semua riwayat error akan dihapus permanen.
                </p>
              </div>
              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Menghapus..." : "Ya, Hapus"}
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
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Error Message</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array(5).fill(null).map((__, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                      ))}
                    </tr>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">Belum ada error</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const methodColor = METHOD_COLORS[log.method] || "bg-gray-100 text-gray-600";
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                        <td className="px-5 py-4 text-sm font-mono text-gray-600">{log.route || "-"}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${methodColor}`}>
                            {log.method || "-"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600" title={log.errorMessage || "-"}>
                          {truncateMessage(log.errorMessage)}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{formatUserAgent(log.userAgent)}</td>
                      </tr>
                    );
                  })
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
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => fetchLogs(pagination.page + 1)}
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
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))
          ) : filteredLogs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Belum ada error</p>
              </div>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const methodColor = METHOD_COLORS[log.method] || "bg-gray-100 text-gray-600";
              return (
                <div key={log.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${methodColor}`}>
                        {log.method || "-"}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                    </div>
                    <div className="text-xs font-mono text-gray-600 truncate">
                      <span className="text-gray-400 font-medium">Route:</span> {log.route || "-"}
                    </div>
                    <div className="text-xs text-gray-600" title={log.errorMessage || "-"}>
                      <span className="text-gray-400 font-medium">Error:</span>{" "}
                      {truncateMessage(log.errorMessage, 60)}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400 font-medium">UA:</span> {formatUserAgent(log.userAgent)}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination - Mobile */}
          {pagination.totalPages > 1 && !loading && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
              <p className="text-xs text-gray-500">Hal {pagination.page}/{pagination.totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => fetchLogs(pagination.page + 1)}
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
          Log ini mencatat semua error yang terjadi pada API routes. Gunakan fitur ini untuk memantau dan memecahkan masalah sistem.
        </p>
      </div>
    </div>
  );
}
