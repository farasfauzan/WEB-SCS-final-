"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

const NILAI_DEFAULTS = [
  { key: "nilai_1", titleKey: "nilai_1_title", descKey: "nilai_1_desc", iconKey: "nilai_1_icon", defaultTitle: "Integritas", defaultDesc: "Kami menjalankan bisnis dengan kejujuran, transparansi, dan tanggung jawab penuh dalam setiap aspek operasional kami.", defaultIcon: "/integritas.svg" },
  { key: "nilai_2", titleKey: "nilai_2_title", descKey: "nilai_2_desc", iconKey: "nilai_2_icon", defaultTitle: "Kualitas", defaultDesc: "Kami berkomitmen pada standar kualitas tertinggi dalam setiap proyek, ensuring hasil yang melampaui ekspektasi klien.", defaultIcon: "/kualitas.svg" },
  { key: "nilai_3", titleKey: "nilai_3_title", descKey: "nilai_3_desc", iconKey: "nilai_3_icon", defaultTitle: "Inovasi", defaultDesc: "Kami terus mengeksplorasi teknologi dan metode konstruksi terbaru untuk memberikan solusi yang lebih efisien dan berkelanjutan.", defaultIcon: "/inovasi.svg" },
  { key: "nilai_4", titleKey: "nilai_4_title", descKey: "nilai_4_desc", iconKey: "nilai_4_icon", defaultTitle: "Kerja Sama Tim", defaultDesc: "Kami percaya bahwa kolaborasi yang kuat antar tim adalah kunci keberhasilan setiap proyek yang kami kerjakan.", defaultIcon: "/kerja-sama-tim.svg" },
];

export default function AboutListPage() {
  const router = useRouter();
  const [abouts, setAbouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchAbouts();
  }, []);

  // Auto-redirect to edit first about
  useEffect(() => {
    if (!loading && abouts.length > 0) {
      router.replace(`/admin/about/${abouts[0].id}`);
    }
  }, [loading, abouts, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  if (abouts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <CldImg src="/icons/about.svg" alt="" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">About Pages</h1>
            <p className="text-gray-500 text-sm mt-1">No about page yet.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
    </div>
  );
}
