"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/project");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await fetch(`/api/project/${id}`, { method: "DELETE" });
    if (res.ok) fetchProjects();
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
              <img src="/icons/project.svg" alt="" className="w-5 h-5 text-[#004282]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your portfolio projects</p>
            </div>
          </div>
        </div>
        <Link href="/admin/project/create" className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
          <img src="/icons/plus.svg" alt="" className="w-4 h-4 brightness-0 invert" />
          Add Project
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
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
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No projects yet.</td></tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-800">{project.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{project.category}</span></td>
                  <td className="p-4 text-sm text-gray-500">{project.client || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {project.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/project/${project.id}`} className="text-[#004282] hover:text-blue-700 text-sm font-medium mr-3">Edit</Link>
                    <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
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
