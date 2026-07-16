"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    const track = () => {
      try {
        // KOREKSI: Gunakan Blob untuk memaksa header Content-Type menjadi application/json
        const data = new Blob([JSON.stringify({})], {
          type: "application/json",
        });
        navigator.sendBeacon("/api/visitor/track", data);
      } catch {
        // Fallback jika browser sangat kuno dan tidak mendukung sendBeacon
        fetch("/api/visitor/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }).catch(() => {}); // Tangkap error secara diam-diam agar tidak mengotori console
      }
    };

    let shouldTrack = true;
    try {
      shouldTrack = !sessionStorage.getItem("visitor_tracked");
    } catch {
      // Abaikan jika sessionStorage diblokir oleh browser
    }

    if (shouldTrack) {
      track();
      try {
        sessionStorage.setItem("visitor_tracked", "1");
      } catch {
        // Abaikan jika gagal menyimpan sesi
      }
    }
  }, []);

  return null;
}
