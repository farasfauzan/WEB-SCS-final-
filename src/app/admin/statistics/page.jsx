"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

export default function StatisticListPage() {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/statistics");
        const data = await res.json();
        setStatistics(data.statistics || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <CldImg src="/icons/statistic.svg" alt="" className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage stats shown on the homepage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
            No statistics yet.
          </div>
        ) : (
          statistics.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center"
            >
              <div className="mb-2 flex justify-center">
                <CldImg
                  src={stat.icon || "/icons/chart.svg"}
                  alt=""
                  className="w-8 h-8"
                />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              <div className="flex justify-center mt-3 pt-3 border-t border-gray-50">
                <Link
                  href={`/admin/statistics/${stat.id}`}
                  className="inline-flex items-center gap-1.5 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
