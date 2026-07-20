"use client";

import { useState, useEffect } from "react";
import CldImg from "@/components/shared/CldImg";

const MODEL_SUGGESTIONS = ["News", "Project", "About", "Hero", "Partner", "Contact", "Statistic", "Setting"];

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

function truncateJson(data, max = 100) {
  if (!data) return "-";
  const str = typeof data === "string" ? data : JSON.stringify(data);
  if (str.length <= max) return str;
  return str.substring(0, max) + "...";
}

export default function AdminRevisionsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [model, setModel] = useState("News");
  const [modelId, setModelId] = useState(1);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/revisions?model=${encodeURIComponent(model)}&modelId=${modelId}&page=${page}`);
      const data = await res.json();
      if (data.revisions) {
        setRevisions(data.revisions);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, [model, modelId, page]);

  const handleModelChange = (e) => {
    setModel(e.target.value);
    setPage(1);
  };

  const handleModelIdChange = (e) => {
    setModelId(Number(e.target.value));
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const tableHeaders = ["Waktu", "Model", "Model ID", "Changed By", "Action"];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <CldImg src="/icons/clock.svg" alt="" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                Revision History
              </h1>
              <p className="text-gray-500 text-xs lg:text-sm mt-0.5">
                Track changes to your content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Model</label>
            <input
              type="text"
              list="model-suggestions"
              value={model}
              onChange={handleModelChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004282] bg-white"
              placeholder="Select or type model..."
            />
            <datalist id="model-suggestions">
              {MODEL_SUGGESTIONS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>
          <div className="w-full sm:w-32">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Model ID</label>
            <input
              type="number"
              value={modelId}
              onChange={handleModelIdChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004282] bg-white"
            />
          </div>
        </div>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      {!isMobile && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {tableHeaders.map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {tableHeaders.map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded w-24"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : revisions.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">Belum ada revisi untuk konten ini.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  revisions.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(rev.createdAt)}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">{rev.model}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{rev.modelId}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{rev.changedBy || "-"}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        <pre className="font-mono text-xs whitespace-pre-wrap break-all bg-gray-50 p-2 rounded-lg border border-gray-100 max-h-24 overflow-auto">
                          {truncateJson(rev.data)}
                        </pre>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Desktop */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
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
          ) : revisions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Belum ada revisi untuk konten ini.</p>
              </div>
            </div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#004282] bg-blue-50 px-2.5 py-1 rounded-full">{rev.model}</span>
                    <span className="text-xs text-gray-500">{formatDate(rev.createdAt)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="text-gray-400 font-medium">Model ID:</span>
                      <p>{rev.modelId}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Changed By:</span>
                      <p>{rev.changedBy || "-"}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 font-medium">Action:</span>
                      <pre className="font-mono text-xs whitespace-pre-wrap break-all bg-gray-50 p-2 rounded-lg border border-gray-100 mt-1">
                        {truncateJson(rev.data, 120)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination - Mobile */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
              <p className="text-xs text-gray-500">Hal {page}/{totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
