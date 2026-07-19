"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";
import { encodeId } from "@/lib/encode-id";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
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
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setRefreshTrigger((prev) => prev + 1);
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <CldImg src="/icons/project.svg" alt="" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Projects</h1>
              <p className="text-gray-500 text-xs lg:text-sm mt-0.5">
                Manage your portfolio projects
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/projects/create"
          className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors shrink-0"
        >
          <CldImg
            src="/icons/plus.svg"
            alt=""
            className="w-4 h-4 brightness-0 invert"
          />
          Add Project
        </Link>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      {!isMobile && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No projects yet.</td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-800 truncate max-w-[200px]">{project.title}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{project.category}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 truncate max-w-[150px]">{project.client || "-"}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {project.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <Link href={`/admin/projects/${encodeId(project.id)}`} className="text-[#004282] hover:text-blue-700 text-sm font-medium mr-3">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(encodeId(project.id))} className="text-red-500 hover:text-red-600 text-sm font-medium">
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
          {projects.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
              No projects yet.
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{project.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{project.client || "No client"}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold ${project.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {project.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-medium">{project.category}</span>
                    {project.location && (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full text-[10px] font-medium">{project.location}</span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-gray-50">
                    <Link
                      href={`/admin/projects/${encodeId(project.id)}`}
                      className="flex-1 text-center text-sm font-semibold text-white bg-[#004282] px-3 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(encodeId(project.id))}
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
