"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE BASE — Semua informasi tentang PT Sinar Cerah Sempurna
// ═══════════════════════════════════════════════════════════

const KNOWLEDGE_BASE = [
  {
    topic: "profil_perusahaan",
    keywords: ["siapa", "apa itu", "perusahaan", "scs", "sinar cerah", "tentang", "profil", "company", "about"],
    answer: "PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia. Kami berpegang teguh pada motto \"Memberi Kepuasan Kepada Relasi\"."
  },
  {
    topic: "layanan",
    keywords: ["layanan", "jasa", "service", "apa saja", "ditawarkan", "kerjakan", "bisa apa", "pekerjaan", "bidang", "spesialisasi"],
    answer: "Layanan kami meliputi:\n\n🏗️ Pembangunan Gedung & Bangunan Komersial\n🛣️ Konstruksi Jalan & Jembatan\n🏛️ Proyek Infrastruktur Publik\n🔧 Renovasi & Rehabilitasi Bangunan\n📐 Konsultasi Perencanaan Konstruksi\n\nSemua proyek dikerjakan dengan standar kualitas tinggi dan tim profesional berpengalaman."
  },
  {
    topic: "lokasi",
    keywords: ["lokasi", "alamat", "kantor", "dimana", "di mana", "semarang", "address", "tempat", "office"],
    answer: "📍 Kantor kami berlokasi di:\nJl. Karangrejo Barat No 09, RT. 02 RW. 02 (Kp. Pentul), Tinjomoyo, Semarang.\n\nAnda bisa langsung berkunjung ke kantor kami atau menghubungi melalui halaman Hubungi Kami di website ini."
  },
  {
    topic: "visi",
    keywords: ["visi", "vision", "cita-cita", "harapan"],
    answer: "Visi kami: Menjadi perusahaan konstruksi dan infrastruktur terdepan serta terpercaya di Indonesia, yang diakui karena keunggulan dalam kualitas, keselamatan, dan pembangunan berkelanjutan."
  },
  {
    topic: "misi",
    keywords: ["misi", "mission", "tugas"],
    answer: "Misi kami:\n\n1️⃣ Memberikan layanan konstruksi berkualitas tinggi yang melampaui ekspektasi klien\n2️⃣ Menerapkan praktik terbaik K3L pada setiap proyek\n3️⃣ Mendorong inovasi melalui teknologi konstruksi mutakhir\n4️⃣ Membangun hubungan jangka panjang berdasarkan kepercayaan\n5️⃣ Mengembangkan kapabilitas profesional tim\n6️⃣ Berkontribusi pada pembangunan berkelanjutan Indonesia"
  },
  {
    topic: "visi_misi",
    keywords: ["visi misi", "visi dan misi", "tujuan", "goal", "target"],
    answer: "🎯 Visi: Menjadi perusahaan konstruksi terdepan dan terpercaya di Indonesia dalam kualitas, keselamatan, dan pembangunan berkelanjutan.\n\n📋 Misi:\n• Layanan berkualitas tinggi melampaui ekspektasi\n• Praktik terbaik K3L di setiap proyek\n• Inovasi teknologi konstruksi mutakhir\n• Hubungan jangka panjang berbasis kepercayaan\n• Pengembangan profesional tim berkelanjutan"
  },
  {
    topic: "pengalaman",
    keywords: ["pengalaman", "berapa lama", "tahun", "statistik", "track record", "portofolio", "pencapaian", "prestasi", "seberapa"],
    answer: "📊 Pencapaian PT Sinar Cerah Sempurna:\n\n✅ 5+ Proyek Besar Selesai\n✅ 50+ Klien Puas\n✅ 25+ Tahun Pengalaman\n✅ 200+ Tim Profesional\n\nDengan pengalaman lebih dari dua dekade, kami telah membuktikan komitmen pada kualitas dan kepuasan klien."
  },
  {
    topic: "nilai",
    keywords: ["nilai", "value", "prinsip", "budaya", "kultur", "inti", "fondasi", "keunggulan"],
    answer: "Fondasi utama keunggulan kami:\n\n🛡️ Integritas — Kejujuran, transparansi, dan tanggung jawab penuh\n💎 Kualitas — Standar tertinggi di setiap proyek\n💡 Inovasi — Teknologi dan metode konstruksi terbaru\n🤝 Kerja Sama Tim — Kolaborasi kuat untuk hasil terbaik"
  },
  {
    topic: "kontak",
    keywords: ["hubungi", "kontak", "contact", "telepon", "email", "cara hubungi", "reach", "whatsapp", "wa"],
    answer: "Anda bisa menghubungi kami melalui:\n\n1️⃣ Halaman \"Hubungi Kami\" di website ini\n2️⃣ Kunjungi kantor: Jl. Karangrejo Barat No 09, Tinjomoyo, Semarang\n3️⃣ Media sosial kami (tersedia di website)\n\nTim kami siap membantu mewujudkan visi konstruksi Anda! 🏗️"
  },
  {
    topic: "proyek",
    keywords: ["proyek", "project", "portfolio", "contoh proyek", "hasil kerja", "pernah", "dikerjakan"],
    answer: "Kami telah mengerjakan berbagai proyek konstruksi dan infrastruktur di Indonesia. Anda bisa melihat detail proyek-proyek kami di halaman Proyek pada website ini.\n\nSetiap proyek kami kerjakan dengan standar kualitas tertinggi dan komitmen pada kepuasan klien. 🏗️"
  },
  {
    topic: "berita",
    keywords: ["berita", "news", "update", "terbaru", "kabar", "informasi terbaru", "artikel"],
    answer: "Untuk berita dan informasi terbaru seputar PT Sinar Cerah Sempurna, silakan kunjungi halaman Berita di website kami.\n\nDi sana Anda bisa menemukan update proyek, pencapaian, dan berbagai kegiatan perusahaan. 📰"
  },
  {
    topic: "karir",
    keywords: ["karir", "kerja", "lowongan", "rekrut", "lamaran", "hiring", "career", "job", "pekerjaan di", "gabung"],
    answer: "Tertarik bergabung dengan tim kami? PT Sinar Cerah Sempurna selalu mencari talenta terbaik!\n\nUntuk informasi lowongan, silakan hubungi kami melalui halaman Hubungi Kami atau kunjungi langsung kantor kami di Semarang. 👷‍♂️"
  },
  {
    topic: "keselamatan",
    keywords: ["keselamatan", "safety", "k3", "keamanan", "aman", "standar keselamatan"],
    answer: "Keselamatan adalah prioritas utama kami. Kami menerapkan:\n\n🔒 Standar K3L (Kesehatan, Keselamatan Kerja & Lingkungan)\n📋 Prosedur keselamatan ketat di setiap proyek\n👷 Pelatihan rutin untuk seluruh tim lapangan\n✅ Peralatan pelindung diri (APD) lengkap\n\nKeselamatan bukan hanya kebijakan, tetapi budaya kerja kami."
  },
  {
    topic: "kerjasama",
    keywords: ["kerjasama", "kerja sama", "partner", "mitra", "kolaborasi", "konsultasi", "ajukan", "konsul"],
    answer: "Kami sangat terbuka untuk kerja sama dan konsultasi proyek! 🤝\n\nLangkah untuk memulai:\n1️⃣ Hubungi kami via halaman Hubungi Kami\n2️⃣ Ceritakan kebutuhan proyek Anda\n3️⃣ Tim kami akan melakukan analisis dan konsultasi\n4️⃣ Kami berikan proposal yang sesuai kebutuhan\n\nMari wujudkan visi konstruksi Anda bersama kami!"
  },
  {
    topic: "motto",
    keywords: ["motto", "slogan", "tagline", "semboyan"],
    answer: "Motto kami: \"Memberi Kepuasan Kepada Relasi\" 🌟\n\nMotto ini mencerminkan komitmen kami untuk selalu mengutamakan kepuasan klien dan mitra kerja dalam setiap proyek yang kami jalankan."
  }
];

// ═══════════════════════════════════════════════════════════
// QUICK FAQ — Tombol FAQ yang ditampilkan di chat
// ═══════════════════════════════════════════════════════════

const QUICK_FAQ = [
  "Apa itu PT Sinar Cerah Sempurna?",
  "Apa saja layanan yang ditawarkan?",
  "Di mana lokasi kantor?",
  "Apa visi dan misi perusahaan?",
  "Berapa pengalaman di industri?",
  "Bagaimana cara menghubungi?",
];

// ═══════════════════════════════════════════════════════════
// SMART MATCHING ENGINE
// ═══════════════════════════════════════════════════════════

function findBestAnswer(input) {
  const lower = input.toLowerCase().replace(/[?!.,]/g, "");
  const words = lower.split(/\s+/);

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    
    for (const keyword of entry.keywords) {
      // Exact substring match (bonus point)
      if (lower.includes(keyword)) {
        score += keyword.split(/\s+/).length * 3;
      }
      
      // Individual word matching
      const kwWords = keyword.split(/\s+/);
      for (const kw of kwWords) {
        for (const word of words) {
          // Exact word
          if (word === kw) score += 2;
          // Fuzzy: word starts with keyword or vice versa (min 3 chars)
          else if (word.length >= 3 && kw.length >= 3) {
            if (word.startsWith(kw.substring(0, 3)) || kw.startsWith(word.substring(0, 3))) {
              score += 1;
            }
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

// ═══════════════════════════════════════════════════════════
// GREETING / SMALL TALK DETECTION
// ═══════════════════════════════════════════════════════════

const GREETINGS = {
  patterns: ["halo", "hai", "hi", "hello", "hey", "selamat", "pagi", "siang", "sore", "malam", "assalamualaikum", "apa kabar"],
  responses: [
    "Halo juga! 😊 Ada yang bisa saya bantu tentang PT Sinar Cerah Sempurna?",
    "Hai! 👋 Senang bisa membantu Anda. Mau tanya apa tentang SCS?",
    "Halo! Selamat datang di SCS AI. Silakan tanyakan apa saja tentang perusahaan kami! 🏗️",
  ]
};

const THANKS = {
  patterns: ["terima kasih", "makasih", "thanks", "thank you", "thx", "tq"],
  responses: [
    "Sama-sama! 😊 Jangan ragu untuk bertanya lagi ya!",
    "Terima kasih kembali! Senang bisa membantu! 🙌",
    "Dengan senang hati! Ada yang lain yang bisa saya bantu? 😊",
  ]
};

const GOODBYE = {
  patterns: ["bye", "dadah", "sampai jumpa", "see you", "goodbye"],
  responses: [
    "Sampai jumpa! Terima kasih sudah menghubungi SCS AI 👋",
    "Bye! Jangan ragu untuk bertanya lagi kapan saja 😊",
  ]
};

function checkSmallTalk(input) {
  const lower = input.toLowerCase();
  
  for (const group of [GREETINGS, THANKS, GOODBYE]) {
    if (group.patterns.some(p => lower.includes(p))) {
      return group.responses[Math.floor(Math.random() * group.responses.length)];
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// FALLBACK RESPONSES
// ═══════════════════════════════════════════════════════════

const FALLBACK_RESPONSES = [
  "Hmm, saya belum punya informasi spesifik tentang itu. 🤔 Coba tanyakan tentang layanan, lokasi, atau profil PT Sinar Cerah Sempurna!\n\nAtau hubungi tim kami langsung melalui halaman Hubungi Kami.",
  "Maaf, saya belum bisa menjawab pertanyaan tersebut. 😅 Saya bisa membantu Anda mengenai:\n• Profil perusahaan\n• Layanan konstruksi\n• Lokasi kantor\n• Visi & Misi\n• Cara menghubungi kami",
  "Pertanyaan menarik! Tapi saya belum punya jawabannya. 🙏 Untuk informasi lebih detail, silakan hubungi tim kami melalui halaman Hubungi Kami di website.",
];

function generateResponse(input) {
  // 1. Check small talk
  const smallTalk = checkSmallTalk(input);
  if (smallTalk) return smallTalk;

  // 2. Check knowledge base
  const match = findBestAnswer(input);
  if (match) return match.answer;

  // 3. Fallback
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Halo! 👋 Saya SCS AI, asisten virtual PT Sinar Cerah Sempurna.\n\nSilakan pilih pertanyaan di bawah atau ketik langsung apa yang ingin Anda tanyakan!" }
  ]);
  const [showFaq, setShowFaq] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    // Dynamic delay based on response length
    const delay = Math.min(400 + text.length * 2, 1500);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: "bot", text }]);
    }, delay);
  };

  const handleFaqClick = (question) => {
    setMessages(prev => [...prev, { type: "user", text: question }]);
    setShowFaq(false);
    const response = generateResponse(question);
    addBotMessage(response);
    setTimeout(() => setShowFaq(true), 1800);
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { type: "user", text: trimmed }]);
    setInputValue("");
    setShowFaq(false);

    const response = generateResponse(trimmed);
    addBotMessage(response);
    setTimeout(() => setShowFaq(true), 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-['Plus_Jakarta_Sans']">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden mb-4 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#004282] px-4 py-3.5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                    <circle cx="8" cy="9" r="1.5"/>
                    <circle cx="16" cy="9" r="1.5"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm leading-tight">SCS AI</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-white/80">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white text-lg"
              >
                ×
              </button>
            </div>

            {/* Area Pesan */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#f7f7f8]">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed max-w-[85%] whitespace-pre-line ${
                    msg.type === "user" 
                      ? "bg-[#004282] text-white rounded-br-md" 
                      : "bg-white text-[#1E1E1E] border border-neutral-200 rounded-bl-md shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-neutral-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex gap-1.5">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </motion.div>
              )}

              {/* FAQ Buttons */}
              <AnimatePresence>
                {showFaq && !isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-1.5 pt-1"
                  >
                    {QUICK_FAQ.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFaqClick(q)}
                        className="text-[11px] font-medium text-[#004282] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-neutral-200 bg-white flex gap-2 shrink-0">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pertanyaan Anda..." 
                className="flex-grow border border-neutral-300 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#004282] focus:ring-1 focus:ring-[#004282]/20 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-[#004282] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold hover:bg-blue-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Kirim
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol Utama */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-400 hover:bg-yellow-500 text-[#004282] p-4 rounded-full shadow-xl transition-all duration-200 focus:outline-none group active:scale-95"
        aria-label="Chatbot AI"
      >
        <svg className="w-7 h-7 fill-current transform group-hover:rotate-12 transition-transform duration-200" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
          <circle cx="8" cy="9" r="1.5"/>
          <circle cx="16" cy="9" r="1.5"/>
          <path d="M11.5 11h1v2h-1z"/>
        </svg>
      </button>
    </div>
  );
}