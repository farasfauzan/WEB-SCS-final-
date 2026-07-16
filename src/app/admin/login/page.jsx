"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CldImg from "@/components/shared/CldImg";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const router = useRouter();

  // PERBAIKAN 1: Menghindari pemanggilan setState sinkron menggunakan setTimeout
  useEffect(() => {
    const initializeState = () => {
      const savedLock = localStorage.getItem("admin_lock_until");
      if (savedLock && Date.now() < Number(savedLock)) {
        setLockUntil(Number(savedLock));
      } else {
        localStorage.removeItem("admin_lock_until"); // Bersihkan jika sudah kedaluwarsa
      }

      const savedAttempts = localStorage.getItem("admin_login_attempts");
      if (savedAttempts) {
        setAttempts(Number(savedAttempts));
      }
    };

    // Mendorong eksekusi ke urutan berikutnya agar linter React tenang
    const timerId = setTimeout(initializeState, 0);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (lockUntil > 0) {
      const timer = setInterval(() => {
        if (Date.now() >= lockUntil) {
          setLockUntil(0);
          setAttempts(0);
          localStorage.removeItem("admin_lock_until");
          localStorage.removeItem("admin_login_attempts");
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockUntil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (lockUntil > 0) {
      const secondsLeft = Math.ceil((lockUntil - Date.now()) / 1000);
      setError(`Terlalu banyak percobaan login. Silakan coba lagi dalam ${secondsLeft} detik.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, action: "login" }),
      });

      const data = await res.json();

      if (!res.ok) {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        localStorage.setItem("admin_login_attempts", nextAttempts);

        if (nextAttempts >= 3) {
          const unlockTime = Date.now() + 1 * 60 * 1000; // Cooldown 1 menit
          setLockUntil(unlockTime);
          localStorage.setItem("admin_lock_until", unlockTime);
          setError(
            "Terlalu banyak percobaan login. Silakan coba lagi dalam 60 detik.",
          );
        } else {
          setError(
            data.error ||
              `Username atau password salah. Sisa percobaan: ${3 - nextAttempts}`,
          );
        }
        return;
      }

      localStorage.removeItem("admin_login_attempts");
      localStorage.removeItem("admin_lock_until");
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // PERBAIKAN 2: Menghapus pemanggilan impure function (Date.now()) dari fase render
  const isLocked = lockUntil > 0;

  return (
    <div className="min-h-screen bg-[#004282] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <CldImg
          src="/hero-bg.svg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <CldImg
            src="/logo-scs.svg"
            alt="SCS Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
            SCS Admin Panel
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Masuk untuk mengelola website
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="login-username"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked || loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004282] focus:border-transparent transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Masukkan username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004282] focus:border-transparent transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs md:text-sm px-4 py-3 rounded-xl leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full bg-[#004282] text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Memproses..." : isLocked ? "Terkunci" : "Masuk"}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-white/50 text-xs">
          PT Sinar Cerah Sempurna - Content Management System
        </p>
      </div>
    </div>
  );
}
