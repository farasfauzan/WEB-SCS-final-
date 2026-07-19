"use client";
import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";

const getContactIcon = (type) => {
  const iconMap = {
    address: "/icons/map-pin.svg",
    phone: "/icons/phone.svg",
    email: "/icons/envelope.svg",
    general: "/icons/clock.svg",
  };
  return iconMap[type] || "/icons/clock.svg";
};

function ContactItem({ icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <CldImg src={icon} alt="" className="w-5 h-5 brightness-0 invert" />
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-white/60 text-[11px] font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

export default function HubungiKamiClient({ initialContacts = [] }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formStatus) setFormStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan");
      setFormStatus({ type: "success", text: data.message });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setFormStatus({ type: "error", text: err.message });
    } finally {
      // KOREKSI: Typo 'finaly' diperbaiki menjadi 'finally'
      setSending(false);
    }
  };

  const getContact = (type) => initialContacts.find((c) => c.type === type);
  const address = getContact("address");
  const phone = getContact("phone");
  const email = getContact("email");
  const general = getContact("general");

  return (
    <main className="relative w-full min-h-[100svh] bg-[#004282] overflow-hidden flex flex-col items-center justify-center pt-24 md:pt-28 pb-12 md:pb-16 px-4 sm:px-6">
      <div className="absolute inset-0 z-0">
        <CldImg
          src="/hero-bg.svg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#004282]/85"></div>
      </div>

      <div className="relative z-10 w-full max-w-[950px] flex flex-col items-center gap-6 md:gap-8">
        <FadeUp delay={0.1} className="text-center flex flex-col gap-2">
          <h1 className="text-white text-2xl md:text-4xl font-extrabold font-['Plus_Jakarta_Sans']">
            Hubungi Kami
          </h1>
          <p className="text-white/90 text-sm md:text-[15px] font-normal">
            Mari diskusikan proyek masa depan Anda bersama kami.
          </p>
        </FadeUp>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <FadeUp delay={0.2} className="w-full">
            <div className="border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-xl h-full flex flex-col justify-between bg-white/10 backdrop-blur-md will-change-transform">
              <h2 className="text-white text-lg md:text-xl font-bold mb-4 md:mb-5">
                Kirimkan Pesan
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
                {formStatus && (
                  <div
                    className={`px-4 py-3 rounded-lg text-sm font-medium ${formStatus.type === "success" ? "bg-green-500/20 text-green-300 border border-green-400/30" : "bg-red-500/20 text-red-300 border border-red-400/30"}`}
                  >
                    {formStatus.text}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    placeholder="Nama Lengkap *"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    placeholder="Alamat Email *"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    placeholder="Nomor Telepon"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    placeholder="Subjek"
                  />
                </div>
                <textarea
                  rows="3"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm resize-none focus:outline-none focus:border-white transition-colors"
                  placeholder="Tulis pesan Anda..."
                ></textarea>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#FFD700] hover:bg-[#F6CA00] text-[#004282] text-sm font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {sending ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>
            </div>
          </FadeUp>

          <FadeUp delay={0.3} className="w-full">
            <div className="border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-6 flex flex-col justify-center gap-5 md:gap-6 shadow-xl h-full bg-white/10 backdrop-blur-md will-change-transform">
              <h2 className="text-white text-lg md:text-xl font-bold">Informasi Kontak</h2>
              <ContactItem icon={getContactIcon(address?.type)} title="Alamat">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address?.value || "Jl. Karangrejo Barat No 09, Tinjomoyo, Semarang")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white text-[14px] transition-colors underline"
                >
                  {address?.value ||
                    "Jl. Karangrejo Barat No 09, Tinjomoyo, Semarang"}
                </a>
              </ContactItem>
              <ContactItem icon={getContactIcon(phone?.type)} title="Telepon">
                <a
                  href={`tel:${phone?.value?.replace(/\s/g, "") || "0248502010"}`}
                  className="text-white/80 text-[14px] underline hover:text-white transition-colors"
                >
                  {phone?.value || "024 8502010"}
                </a>
              </ContactItem>
              <ContactItem icon={getContactIcon(email?.type)} title="Email">
                <a
                  href={`mailto:${email?.value || "info@ptsinarcerahsempurna.com"}`}
                  className="text-white/80 text-[14px] underline hover:text-white transition-colors"
                >
                  {email?.value || "info@ptsinarcerahsempurna.com"}
                </a>
              </ContactItem>
              <ContactItem
                icon={getContactIcon(general?.type)}
                title="Jam Operasional"
              >
                <p className="text-white/80 text-[14px] whitespace-pre-line">
                  {general?.value ||
                    "Senin - Jumat: 08.00 - 17.00 WIB\nSabtu: 08.00 - 12.00 WIB"}
                </p>
              </ContactItem>
            </div>
          </FadeUp>
        </div>
      </div>
    </main>
  );
}
