"use client";

import { useState } from "react";

export default function NewsletterForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal subscribe");
      }

      setSubscribed(true);
      setEmail("");
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <p className="text-sm text-green-600 font-medium">
        Terima kasih! Berhasil subscribe.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-0"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Anda"
        required
        className="flex-1 px-4 py-2.5 border rounded-l-lg sm:rounded-r-none rounded-r-lg sm:rounded-l-lg text-sm focus:outline-none focus:border-[#004282] focus:ring-1 focus:ring-[#004282]/20"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-[#004282] text-white rounded-l-lg sm:rounded-l-none rounded-r-lg sm:rounded-r-lg font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Mengirim..." : "Subscribe"}
      </button>
      {error && <p className="text-red-500 text-xs mt-1 sm:mt-0 sm:ml-0">{error}</p>}
    </form>
  );
}
